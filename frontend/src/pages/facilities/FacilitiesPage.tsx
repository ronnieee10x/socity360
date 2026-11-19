import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { FacilityResponseDto, FacilityBookingResponseDto } from '../../types';
import {
  CalendarDays,
  Clock,
  Users,
  Plus,
  AlertTriangle,
  CheckCircle2,
  Calendar,
  X,
  Building,
  ShieldAlert,
  Sparkles
} from 'lucide-react';

export const FacilitiesPage: React.FC = () => {
  const { user } = useAuth();
  const isAdminOrCommittee = user?.role === 'SOCIETY_ADMIN' || user?.role === 'COMMITTEE_MEMBER';

  const [facilities, setFacilities] = useState<FacilityResponseDto[]>([]);
  const [myBookings, setMyBookings] = useState<FacilityBookingResponseDto[]>([]);
  const [myOccupancy, setMyOccupancy] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Booking Modal
  const [showBookModal, setShowBookModal] = useState(false);
  const [selectedFacility, setSelectedFacility] = useState<FacilityResponseDto | null>(null);
  const [bookingDate, setBookingDate] = useState(
    new Date(Date.now() + 86400000).toISOString().split('T')[0]
  );
  const [startTime, setStartTime] = useState('10:00');
  const [endTime, setEndTime] = useState('12:00');
  const [submittingBooking, setSubmittingBooking] = useState(false);
  const [conflictError, setConflictError] = useState('');

  // Add Facility Modal (Admin)
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [submittingCreate, setSubmittingCreate] = useState(false);
  const [createForm, setCreateForm] = useState({
    name: '',
    capacity: 50,
    bookingChargePerHour: 200,
    openingTime: '06:00',
    closingTime: '22:00'
  });

  const loadData = async () => {
    try {
      setLoading(true);
      const [facRes, bookRes, occRes] = await Promise.all([
        api.get('/facilities').catch(() => ({ data: { data: [] } })),
        isAdminOrCommittee
          ? api.get('/facilities/bookings').catch(() => ({ data: { data: [] } }))
          : api.get('/facilities/bookings/my').catch(() => ({ data: { data: [] } })),
        api.get('/residents/my-occupancy').catch(() => ({ data: { data: null } }))
      ]);

      setFacilities(facRes.data?.data || []);
      setMyBookings(bookRes.data?.data || []);
      setMyOccupancy(occRes.data?.data || null);
    } catch (err) {
      console.error('Failed to load facilities data', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleBookSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFacility || !myOccupancy?.flatId) {
      setConflictError('You must be an approved resident of a flat to reserve amenities.');
      return;
    }

    try {
      setSubmittingBooking(true);
      setConflictError('');

      await api.post('/facilities/bookings', {
        facilityId: selectedFacility.id,
        flatId: myOccupancy.flatId,
        bookingDate: bookingDate,
        startTime: startTime + ':00',
        endTime: endTime + ':00'
      });

      setShowBookModal(false);
      setSelectedFacility(null);
      loadData();
    } catch (err: any) {
      if (err.response?.status === 409) {
        setConflictError(
          err.response?.data?.message ||
            'Double-Booking Conflict: This slot is already booked by another resident.'
        );
      } else {
        setConflictError(err.response?.data?.message || 'Failed to complete booking.');
      }
    } finally {
      setSubmittingBooking(false);
    }
  };

  const handleCreateFacility = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSubmittingCreate(true);
      await api.post('/facilities', {
        name: createForm.name,
        capacity: Number(createForm.capacity),
        bookingChargePerHour: Number(createForm.bookingChargePerHour),
        openingTime: createForm.openingTime + ':00',
        closingTime: createForm.closingTime + ':00'
      });
      setShowCreateModal(false);
      setCreateForm({
        name: '',
        capacity: 50,
        bookingChargePerHour: 200,
        openingTime: '06:00',
        closingTime: '22:00'
      });
      loadData();
    } catch (err) {
      console.error('Failed to create facility', err);
    } finally {
      setSubmittingCreate(false);
    }
  };

  const handleCancelBooking = async (bookingId: string) => {
    if (!confirm('Are you sure you want to cancel this reservation?')) return;
    try {
      await api.delete(`/facilities/bookings/${bookingId}`);
      loadData();
    } catch (err) {
      console.error('Failed to cancel booking', err);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <CalendarDays className="w-6 h-6 text-indigo-600" />
            Facilities & Amenity Booking
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Reserve community amenities with real-time slot conflict detection and automated concurrency locking.
          </p>
        </div>
        {isAdminOrCommittee && (
          <button
            onClick={() => setShowCreateModal(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-semibold transition-colors shadow-sm shadow-indigo-200"
          >
            <Plus className="w-4 h-4" />
            Add New Facility
          </button>
        )}
      </div>

      {/* Facilities Grid */}
      <div className="space-y-3">
        <h2 className="text-base font-bold text-slate-800 flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-indigo-600" />
          Society Amenities
        </h2>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
          </div>
        ) : facilities.length === 0 ? (
          <div className="bg-white rounded-2xl p-8 text-center border border-slate-100">
            <p className="text-sm text-slate-500">No amenities configured yet for this society.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {facilities.map((fac) => (
              <div
                key={fac.id}
                className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between">
                    <h3 className="font-bold text-slate-900 text-base">{fac.name}</h3>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                      {fac.status}
                    </span>
                  </div>

                  <div className="mt-4 space-y-2 text-xs text-slate-600">
                    <div className="flex items-center gap-2">
                      <Users className="w-3.5 h-3.5 text-slate-400" />
                      <span>Capacity: {fac.capacity} people</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      <span>
                        Hours: {fac.openingTime.slice(0, 5)} - {fac.closingTime.slice(0, 5)}
                      </span>
                    </div>
                    <div className="text-sm font-bold text-indigo-700 pt-1">
                      {Number(fac.bookingChargePerHour) > 0 ? (
                        <span>₹{Number(fac.bookingChargePerHour).toLocaleString()} / hour</span>
                      ) : (
                        <span className="text-emerald-600">Complimentary (Free)</span>
                      )}
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => {
                    setSelectedFacility(fac);
                    setConflictError('');
                    setShowBookModal(true);
                  }}
                  className="mt-5 w-full py-2 bg-indigo-50 hover:bg-indigo-600 hover:text-white text-indigo-700 rounded-xl text-xs font-semibold transition-all"
                >
                  Book Slot
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Bookings Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <h2 className="text-base font-bold text-slate-800">
            {isAdminOrCommittee ? 'All Confirmed Facility Reservations' : 'Your Reserved Slots'}
          </h2>
          <span className="text-xs text-slate-500 font-medium">
            {myBookings.length} total reservation(s)
          </span>
        </div>

        {myBookings.length === 0 ? (
          <div className="p-12 text-center text-slate-500">
            <Calendar className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="font-semibold text-slate-700">No Reservations Found</h3>
            <p className="text-xs text-slate-400 mt-1">Select an amenity above to reserve your slot.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-slate-50 text-slate-700 font-bold border-b border-slate-100 uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="py-3 px-4">Amenity</th>
                  <th className="py-3 px-4">Reserved By</th>
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4">Slot Time</th>
                  <th className="py-3 px-4">Total Fee</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {myBookings.map((b) => (
                  <tr key={b.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3.5 px-4 font-bold text-slate-900">{b.facilityName}</td>
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-slate-900">{b.bookedByName}</div>
                      <div className="text-[11px] text-slate-400">Flat {b.flatNumber}</div>
                    </td>
                    <td className="py-3.5 px-4 font-medium text-slate-700">{b.bookingDate}</td>
                    <td className="py-3.5 px-4 font-mono font-medium text-indigo-700">
                      {b.startTime.slice(0, 5)} - {b.endTime.slice(0, 5)}
                    </td>
                    <td className="py-3.5 px-4 font-bold text-slate-900">
                      ₹{Number(b.totalCost).toLocaleString()}
                    </td>
                    <td className="py-3.5 px-4">
                      {b.status === 'CONFIRMED' ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                          <CheckCircle2 className="w-3 h-3" /> Confirmed
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-slate-100 text-slate-700">
                          {b.status}
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      {b.status === 'CONFIRMED' && (
                        <button
                          onClick={() => handleCancelBooking(b.id)}
                          className="text-xs text-rose-600 hover:text-rose-800 font-semibold"
                        >
                          Cancel
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Book Amenity Modal */}
      {showBookModal && selectedFacility && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden border border-slate-100">
            <div className="flex items-center justify-between p-6 border-b border-slate-100">
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <CalendarDays className="w-5 h-5 text-indigo-600" />
                Reserve {selectedFacility.name}
              </h2>
              <button
                onClick={() => setShowBookModal(false)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleBookSubmit} className="p-6 space-y-4">
              {conflictError && (
                <div className="p-3 text-xs bg-rose-50 text-rose-700 rounded-xl border border-rose-200 flex items-start gap-2">
                  <ShieldAlert className="w-4 h-4 shrink-0 mt-0.5" />
                  <div>
                    <div className="font-bold">Slot Collision Detected</div>
                    <div>{conflictError}</div>
                  </div>
                </div>
              )}

              <div className="p-3 bg-slate-50 rounded-xl text-xs space-y-1 border border-slate-100">
                <div className="flex justify-between">
                  <span className="text-slate-500">Operating Hours:</span>
                  <span className="font-semibold text-slate-800">
                    {selectedFacility.openingTime.slice(0, 5)} - {selectedFacility.closingTime.slice(0, 5)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Rate:</span>
                  <span className="font-bold text-indigo-600">
                    ₹{Number(selectedFacility.bookingChargePerHour).toLocaleString()} / hour
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Reservation Date *
                </label>
                <input
                  type="date"
                  required
                  min={new Date().toISOString().split('T')[0]}
                  value={bookingDate}
                  onChange={(e) => setBookingDate(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Start Time *</label>
                  <input
                    type="time"
                    required
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">End Time *</label>
                  <input
                    type="time"
                    required
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                  />
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowBookModal(false)}
                  className="px-4 py-2 border border-slate-200 text-slate-600 rounded-xl text-xs font-semibold hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submittingBooking}
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold transition-colors disabled:opacity-50"
                >
                  {submittingBooking ? 'Checking Availability...' : 'Confirm Reservation'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Create Facility Modal (Admin) */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden border border-slate-100">
            <div className="flex items-center justify-between p-6 border-b border-slate-100">
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <Plus className="w-5 h-5 text-indigo-600" />
                Add Community Amenity
              </h2>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateFacility} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Amenity Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Squash Court, Roof-deck Lounge"
                  value={createForm.name}
                  onChange={(e) => setCreateForm({ ...createForm, name: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Capacity *</label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={createForm.capacity}
                    onChange={(e) => setCreateForm({ ...createForm, capacity: Number(e.target.value) })}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Charge / Hour (₹) *
                  </label>
                  <input
                    type="number"
                    required
                    min="0"
                    value={createForm.bookingChargePerHour}
                    onChange={(e) =>
                      setCreateForm({ ...createForm, bookingChargePerHour: Number(e.target.value) })
                    }
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Opening Time *</label>
                  <input
                    type="time"
                    required
                    value={createForm.openingTime}
                    onChange={(e) => setCreateForm({ ...createForm, openingTime: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Closing Time *</label>
                  <input
                    type="time"
                    required
                    value={createForm.closingTime}
                    onChange={(e) => setCreateForm({ ...createForm, closingTime: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                  />
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 border border-slate-200 text-slate-600 rounded-xl text-xs font-semibold hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submittingCreate}
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold transition-colors disabled:opacity-50"
                >
                  {submittingCreate ? 'Saving...' : 'Add Amenity'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
export default FacilitiesPage;
