import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import { Building, Wing, Flat } from '../../types';
import {
  Building2,
  Home,
  Plus,
  Search,
  Filter,
  CheckCircle,
  AlertCircle,
  X
} from 'lucide-react';

export const PropertyManagementPage: React.FC = () => {
  const [buildings, setBuildings] = useState<Building[]>([]);
  const [wings, setWings] = useState<Wing[]>([]);
  const [flats, setFlats] = useState<any[]>([]);

  const [selectedBuildingId, setSelectedBuildingId] = useState<string>('');
  const [selectedWingId, setSelectedWingId] = useState<string>('');
  const [occupancyFilter, setOccupancyFilter] = useState<string>('');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Modals state
  const [showAddBuilding, setShowAddBuilding] = useState(false);
  const [showAddWing, setShowAddWing] = useState(false);
  const [showAddFlat, setShowAddFlat] = useState(false);

  // Form states
  const [newBuilding, setNewBuilding] = useState({ name: '', totalFloors: 1, description: '' });
  const [newWing, setNewWing] = useState({ buildingId: '', name: '' });
  const [newFlat, setNewFlat] = useState({
    buildingId: '',
    wingId: '',
    flatNumber: '',
    floorNumber: 1,
    flatType: '2BHK',
    squareFeet: 1150.0,
  });

  const loadData = async () => {
    try {
      setLoading(true);
      const bRes = await api.get('/buildings');
      const bldgs = bRes.data?.data || [];
      setBuildings(bldgs);

      if (bldgs.length > 0 && !selectedBuildingId) {
        setSelectedBuildingId(bldgs[0].id);
      }

      await loadFlats();
    } catch (err) {
      console.error('Failed to load property data', err);
    } finally {
      setLoading(false);
    }
  };

  const loadWingsForBuilding = async (bldgId: string) => {
    if (!bldgId) return;
    try {
      const res = await api.get(`/buildings/${bldgId}/wings`);
      setWings(res.data?.data || []);
    } catch (err) {
      console.error('Failed to load wings', err);
    }
  };

  const loadFlats = async () => {
    try {
      let url = '/flats';
      const params = new URLSearchParams();
      if (selectedBuildingId) params.append('buildingId', selectedBuildingId);
      if (selectedWingId) params.append('wingId', selectedWingId);
      if (occupancyFilter) params.append('occupancyStatus', occupancyFilter);

      if (params.toString()) {
        url += `?${params.toString()}`;
      }

      const res = await api.get(url);
      setFlats(res.data?.data || []);
    } catch (err) {
      console.error('Failed to load flats', err);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (selectedBuildingId) {
      loadWingsForBuilding(selectedBuildingId);
    }
    loadFlats();
  }, [selectedBuildingId, selectedWingId, occupancyFilter]);

  const handleCreateBuilding = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await api.post('/buildings', newBuilding);
      if (res.data?.success) {
        setShowAddBuilding(false);
        setNewBuilding({ name: '', totalFloors: 1, description: '' });
        loadData();
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to add building');
    }
  };

  const handleCreateWing = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await api.post(`/buildings/${newWing.buildingId}/wings`, { name: newWing.name });
      if (res.data?.success) {
        setShowAddWing(false);
        setNewWing({ buildingId: '', name: '' });
        loadWingsForBuilding(selectedBuildingId);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to create wing');
    }
  };

  const handleCreateFlat = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await api.post('/flats', newFlat);
      if (res.data?.success) {
        setShowAddFlat(false);
        setNewFlat({
          buildingId: selectedBuildingId,
          wingId: wings[0]?.id || '',
          flatNumber: '',
          floorNumber: 1,
          flatType: '2BHK',
          squareFeet: 1150.0,
        });
        loadFlats();
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to create flat');
    }
  };

  const filteredFlats = flats.filter((f) =>
    f.flatNumber.toLowerCase().includes(search.toLowerCase()) ||
    (f.wingName && f.wingName.toLowerCase().includes(search.toLowerCase())) ||
    f.flatType.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">Buildings & Flats Management</h2>
          <p className="text-xs text-slate-500 mt-0.5">Hierarchical Property Structure: Society $\to$ Building $\to$ Wing $\to$ Floor $\to$ Flat</p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowAddBuilding(true)}
            className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl transition flex items-center gap-1.5 shadow-sm"
          >
            <Plus className="w-3.5 h-3.5 text-emerald-400" />
            <span>Add Building</span>
          </button>
          <button
            onClick={() => {
              setNewWing((prev) => ({ ...prev, buildingId: selectedBuildingId }));
              setShowAddWing(true);
            }}
            className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition flex items-center gap-1.5 border border-slate-200"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Wing</span>
          </button>
          <button
            onClick={() => {
              setNewFlat((prev) => ({
                ...prev,
                buildingId: selectedBuildingId,
                wingId: wings[0]?.id || '',
              }));
              setShowAddFlat(true);
            }}
            className="px-3.5 py-2 bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs rounded-xl transition flex items-center gap-1.5 shadow-sm shadow-emerald-500/20"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Register Flat</span>
          </button>
        </div>
      </div>

      {error && (
        <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
          <button onClick={() => setError(null)} className="text-rose-500 hover:text-rose-700 font-bold">✕</button>
        </div>
      )}

      {/* Buildings Navigation Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {buildings.map((b) => (
          <button
            key={b.id}
            onClick={() => { setSelectedBuildingId(b.id); setSelectedWingId(''); }}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 whitespace-nowrap ${
              selectedBuildingId === b.id
                ? 'bg-slate-900 text-white shadow-sm'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <Building2 className={`w-3.5 h-3.5 ${selectedBuildingId === b.id ? 'text-emerald-400' : 'text-slate-400'}`} />
            <span>{b.name}</span>
            <span className={`text-[10px] px-1.5 py-0.2 rounded font-mono ${selectedBuildingId === b.id ? 'bg-slate-800 text-slate-300' : 'bg-slate-100 text-slate-500'}`}>
              {b.totalFloors} flrs
            </span>
          </button>
        ))}
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-2 w-full sm:w-auto">
          {/* Wing Selector */}
          <select
            value={selectedWingId}
            onChange={(e) => setSelectedWingId(e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs text-slate-700 font-medium focus:outline-none focus:border-emerald-500 cursor-pointer"
          >
            <option value="">All Wings</option>
            {wings.map((w) => (
              <option key={w.id} value={w.id}>{w.name}</option>
            ))}
          </select>

          {/* Occupancy Filter */}
          <select
            value={occupancyFilter}
            onChange={(e) => setOccupancyFilter(e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs text-slate-700 font-medium focus:outline-none focus:border-emerald-500 cursor-pointer"
          >
            <option value="">All Occupancies</option>
            <option value="VACANT">Vacant</option>
            <option value="OWNER_OCCUPIED">Owner Occupied</option>
            <option value="TENANT_OCCUPIED">Tenant Occupied</option>
          </select>
        </div>

        {/* Search Input */}
        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search flat number, wing, type..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-1.5 text-xs text-slate-900 focus:outline-none focus:border-emerald-500"
          />
        </div>
      </div>

      {/* Visual Flat Matrix Grid */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-slate-900 text-sm">Flats Directory & Occupancy Status</h3>
          <span className="text-xs text-slate-500 font-medium">{filteredFlats.length} flats displayed</span>
        </div>

        {loading ? (
          <div className="py-12 text-center text-xs text-slate-400">Loading units...</div>
        ) : filteredFlats.length === 0 ? (
          <div className="py-12 text-center text-xs text-slate-400">No flats found matching criteria.</div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {filteredFlats.map((flat) => (
              <div
                key={flat.id}
                className="p-3.5 rounded-xl border border-slate-200 hover:border-emerald-500/60 transition bg-slate-50/50 hover:bg-white hover:shadow-md flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between">
                    <span className="font-black text-slate-900 text-base">{flat.flatNumber}</span>
                    <span
                      className={`w-2 h-2 rounded-full mt-1.5 ${
                        flat.occupancyStatus === 'OWNER_OCCUPIED'
                          ? 'bg-emerald-500'
                          : flat.occupancyStatus === 'TENANT_OCCUPIED'
                          ? 'bg-teal-500'
                          : 'bg-slate-300'
                      }`}
                      title={flat.occupancyStatus}
                    />
                  </div>
                  <p className="text-[11px] text-slate-500 mt-0.5">{flat.wingName || 'Wing'}</p>
                </div>

                <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-400">
                  <span className="font-mono">{flat.flatType}</span>
                  <span>{flat.squareFeet} sq ft</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal: Add Building */}
      {showAddBuilding && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
            <div className="flex justify-between items-center pb-3 border-b border-slate-100 mb-4">
              <h3 className="font-bold text-slate-900 text-base">Add New Building / Tower</h3>
              <button onClick={() => setShowAddBuilding(false)} className="text-slate-400 hover:text-slate-600"><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleCreateBuilding} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Building Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Tower C"
                  value={newBuilding.name}
                  onChange={(e) => setNewBuilding({ ...newBuilding, name: e.target.value })}
                  className="w-full border border-slate-200 rounded-lg p-2 focus:border-emerald-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Total Floors</label>
                <input
                  type="number"
                  min={1}
                  required
                  value={newBuilding.totalFloors}
                  onChange={(e) => setNewBuilding({ ...newBuilding, totalFloors: parseInt(e.target.value) || 1 })}
                  className="w-full border border-slate-200 rounded-lg p-2 focus:border-emerald-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Description</label>
                <textarea
                  rows={2}
                  placeholder="Description..."
                  value={newBuilding.description}
                  onChange={(e) => setNewBuilding({ ...newBuilding, description: e.target.value })}
                  className="w-full border border-slate-200 rounded-lg p-2 focus:border-emerald-500 focus:outline-none"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setShowAddBuilding(false)} className="px-4 py-2 bg-slate-100 rounded-xl font-bold">Cancel</button>
                <button type="submit" className="px-5 py-2 bg-emerald-500 text-white rounded-xl font-bold">Save Building</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Add Wing */}
      {showAddWing && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
            <div className="flex justify-between items-center pb-3 border-b border-slate-100 mb-4">
              <h3 className="font-bold text-slate-900 text-base">Add Wing to Building</h3>
              <button onClick={() => setShowAddWing(false)} className="text-slate-400 hover:text-slate-600"><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleCreateWing} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Target Building</label>
                <select
                  required
                  value={newWing.buildingId}
                  onChange={(e) => setNewWing({ ...newWing, buildingId: e.target.value })}
                  className="w-full border border-slate-200 rounded-lg p-2 focus:border-emerald-500 focus:outline-none"
                >
                  <option value="">Select Building</option>
                  {buildings.map((b) => (
                    <option key={b.id} value={b.id}>{b.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Wing Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. East Wing / Wing A"
                  value={newWing.name}
                  onChange={(e) => setNewWing({ ...newWing, name: e.target.value })}
                  className="w-full border border-slate-200 rounded-lg p-2 focus:border-emerald-500 focus:outline-none"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setShowAddWing(false)} className="px-4 py-2 bg-slate-100 rounded-xl font-bold">Cancel</button>
                <button type="submit" className="px-5 py-2 bg-emerald-500 text-white rounded-xl font-bold">Create Wing</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Register Flat */}
      {showAddFlat && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
            <div className="flex justify-between items-center pb-3 border-b border-slate-100 mb-4">
              <h3 className="font-bold text-slate-900 text-base">Register Flat Unit</h3>
              <button onClick={() => setShowAddFlat(false)} className="text-slate-400 hover:text-slate-600"><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleCreateFlat} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Building</label>
                  <select
                    required
                    value={newFlat.buildingId}
                    onChange={(e) => {
                      setNewFlat({ ...newFlat, buildingId: e.target.value });
                      loadWingsForBuilding(e.target.value);
                    }}
                    className="w-full border border-slate-200 rounded-lg p-2 focus:border-emerald-500 focus:outline-none"
                  >
                    <option value="">Select Building</option>
                    {buildings.map((b) => (
                      <option key={b.id} value={b.id}>{b.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Wing</label>
                  <select
                    required
                    value={newFlat.wingId}
                    onChange={(e) => setNewFlat({ ...newFlat, wingId: e.target.value })}
                    className="w-full border border-slate-200 rounded-lg p-2 focus:border-emerald-500 focus:outline-none"
                  >
                    <option value="">Select Wing</option>
                    {wings.map((w) => (
                      <option key={w.id} value={w.id}>{w.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Flat Number</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. A-402"
                    value={newFlat.flatNumber}
                    onChange={(e) => setNewFlat({ ...newFlat, flatNumber: e.target.value })}
                    className="w-full border border-slate-200 rounded-lg p-2 focus:border-emerald-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Floor Number</label>
                  <input
                    type="number"
                    required
                    value={newFlat.floorNumber}
                    onChange={(e) => setNewFlat({ ...newFlat, floorNumber: parseInt(e.target.value) || 1 })}
                    className="w-full border border-slate-200 rounded-lg p-2 focus:border-emerald-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Flat Type</label>
                  <select
                    value={newFlat.flatType}
                    onChange={(e) => setNewFlat({ ...newFlat, flatType: e.target.value })}
                    className="w-full border border-slate-200 rounded-lg p-2 focus:border-emerald-500 focus:outline-none"
                  >
                    <option value="1BHK">1BHK</option>
                    <option value="2BHK">2BHK</option>
                    <option value="3BHK">3BHK</option>
                    <option value="4BHK">4BHK</option>
                    <option value="PENTHOUSE">Penthouse</option>
                    <option value="STUDIO">Studio</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Square Feet</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={newFlat.squareFeet}
                    onChange={(e) => setNewFlat({ ...newFlat, squareFeet: parseFloat(e.target.value) || 100 })}
                    className="w-full border border-slate-200 rounded-lg p-2 focus:border-emerald-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3">
                <button type="button" onClick={() => setShowAddFlat(false)} className="px-4 py-2 bg-slate-100 rounded-xl font-bold">Cancel</button>
                <button type="submit" className="px-5 py-2 bg-emerald-500 text-white rounded-xl font-bold">Register Flat</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
