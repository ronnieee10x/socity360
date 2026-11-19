import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../../services/api';
import {
  Building2,
  FileCheck2,
  UserCheck,
  Upload,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

export const SocietyRegistrationPage: React.FC = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successData, setSuccessData] = useState<any>(null);

  const [formData, setFormData] = useState({
    societyName: '',
    registrationNumber: '',
    addressLine: '',
    city: '',
    state: '',
    pinCode: '',
    buildingCount: 2,
    flatCount: 40,
    applicantName: '',
    applicantEmail: '',
    applicantPhone: '',
    documentUrl: 'https://docs.society360.io/sample-registration-cert.pdf',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'buildingCount' || name === 'flatCount' ? parseInt(value) || 0 : value,
    }));
  };

  const validateStep1 = () => {
    if (!formData.societyName || !formData.registrationNumber || !formData.addressLine || !formData.city || !formData.state || !formData.pinCode) {
      setError('Please fill in all society location and registration fields.');
      return false;
    }
    setError(null);
    return true;
  };

  const validateStep2 = () => {
    if (formData.buildingCount < 1 || formData.flatCount < 1) {
      setError('Buildings and flat counts must be at least 1.');
      return false;
    }
    setError(null);
    return true;
  };

  const validateStep3 = () => {
    if (!formData.applicantName || !formData.applicantEmail || !formData.applicantPhone) {
      setError('Please provide representative contact details.');
      return false;
    }
    setError(null);
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await api.post('/societies/apply', formData);
      if (res.data?.success) {
        setSuccessData(res.data.data);
      } else {
        setError(res.data?.message || 'Submission failed');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to submit application. Please verify details.');
    } finally {
      setLoading(false);
    }
  };

  if (successData) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6 text-white">
        <div className="max-w-xl w-full bg-slate-900 border border-slate-800 rounded-3xl p-8 sm:p-10 text-center shadow-2xl">
          <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mx-auto mb-6">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Application Submitted!</h2>
          <p className="text-slate-400 text-sm mb-6">
            Your society registration application has been received and registered under status <span className="font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">PENDING</span>.
          </p>

          <div className="bg-slate-950 rounded-xl p-4 border border-slate-800 text-left text-xs space-y-2 mb-8">
            <div className="flex justify-between">
              <span className="text-slate-500">Society Name:</span>
              <span className="text-slate-200 font-semibold">{successData.societyName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Registration No:</span>
              <span className="text-slate-200 font-mono">{successData.registrationNumber}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Applicant:</span>
              <span className="text-slate-200 font-semibold">{successData.applicantName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Application Reference ID:</span>
              <span className="text-emerald-400 font-mono truncate">{successData.id}</span>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700/60 text-xs text-slate-300 text-left mb-8">
            <p className="font-bold text-white mb-1">What happens next?</p>
            <p>1. The Platform Super Admin reviews the legal documents in the verification queue.</p>
            <p>2. Once approved, your society workspace is provisioned and your Society Admin credentials will be activated.</p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <Link
              to="/login"
              className="flex-1 py-3 px-4 bg-emerald-500 hover:bg-emerald-600 font-bold rounded-xl text-sm transition"
            >
              Go to Login / Demo
            </Link>
            <Link
              to="/landing"
              className="flex-1 py-3 px-4 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold rounded-xl text-sm transition"
            >
              Return Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 py-12 px-6 lg:px-8 text-white flex flex-col justify-center">
      <div className="max-w-3xl w-full mx-auto">
        <div className="text-center mb-8">
          <Link to="/landing" className="inline-flex items-center gap-2 text-slate-400 hover:text-emerald-400 text-xs mb-4 transition">
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Society360</span>
          </Link>
          <h1 className="text-3xl font-black tracking-tight text-white">Register Your Housing Society</h1>
          <p className="text-slate-400 text-sm mt-1">Multi-step onboarding for residential communities and cooperative housing societies</p>
        </div>

        {/* Step Indicator */}
        <div className="flex items-center justify-between max-w-md mx-auto mb-8 text-xs font-semibold">
          <div className={`flex items-center gap-2 ${step >= 1 ? 'text-emerald-400' : 'text-slate-600'}`}>
            <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${step >= 1 ? 'bg-emerald-500 text-slate-950' : 'bg-slate-800 text-slate-500'}`}>1</span>
            <span>Society</span>
          </div>
          <div className={`h-0.5 flex-1 mx-2 ${step >= 2 ? 'bg-emerald-500' : 'bg-slate-800'}`} />
          <div className={`flex items-center gap-2 ${step >= 2 ? 'text-emerald-400' : 'text-slate-600'}`}>
            <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${step >= 2 ? 'bg-emerald-500 text-slate-950' : 'bg-slate-800 text-slate-500'}`}>2</span>
            <span>Units</span>
          </div>
          <div className={`h-0.5 flex-1 mx-2 ${step >= 3 ? 'bg-emerald-500' : 'bg-slate-800'}`} />
          <div className={`flex items-center gap-2 ${step >= 3 ? 'text-emerald-400' : 'text-slate-600'}`}>
            <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${step >= 3 ? 'bg-emerald-500 text-slate-950' : 'bg-slate-800 text-slate-500'}`}>3</span>
            <span>Contact</span>
          </div>
          <div className={`h-0.5 flex-1 mx-2 ${step >= 4 ? 'bg-emerald-500' : 'bg-slate-800'}`} />
          <div className={`flex items-center gap-2 ${step >= 4 ? 'text-emerald-400' : 'text-slate-600'}`}>
            <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${step >= 4 ? 'bg-emerald-500 text-slate-950' : 'bg-slate-800 text-slate-500'}`}>4</span>
            <span>Docs</span>
          </div>
        </div>

        {error && (
          <div className="mb-6 p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 sm:p-10 shadow-2xl">
          <form onSubmit={handleSubmit}>
            {step === 1 && (
              <div className="space-y-4">
                <h3 className="text-base font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-3">
                  <Building2 className="w-5 h-5 text-emerald-400" />
                  <span>Step 1: Society Legal & Location Details</span>
                </h3>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Society Name</label>
                  <input
                    type="text"
                    name="societyName"
                    value={formData.societyName}
                    onChange={handleChange}
                    placeholder="e.g. Greenfield Heights Co-op Housing Society"
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-sm text-slate-100 placeholder-slate-600 focus:border-emerald-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Government Registration Number</label>
                  <input
                    type="text"
                    name="registrationNumber"
                    value={formData.registrationNumber}
                    onChange={handleChange}
                    placeholder="e.g. REG-MH-PUN-2024-0012"
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-sm text-slate-100 placeholder-slate-600 focus:border-emerald-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Address Line</label>
                  <textarea
                    name="addressLine"
                    rows={2}
                    value={formData.addressLine}
                    onChange={handleChange}
                    placeholder="Survey No, Street, Landmark"
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-sm text-slate-100 placeholder-slate-600 focus:border-emerald-500 focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">City</label>
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      placeholder="e.g. Pune"
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-sm text-slate-100 placeholder-slate-600 focus:border-emerald-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">State</label>
                    <input
                      type="text"
                      name="state"
                      value={formData.state}
                      onChange={handleChange}
                      placeholder="e.g. Maharashtra"
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-sm text-slate-100 placeholder-slate-600 focus:border-emerald-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">PIN Code</label>
                    <input
                      type="text"
                      name="pinCode"
                      value={formData.pinCode}
                      onChange={handleChange}
                      placeholder="e.g. 411045"
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-sm text-slate-100 placeholder-slate-600 focus:border-emerald-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="pt-4 flex justify-end">
                  <button
                    type="button"
                    onClick={() => { if (validateStep1()) setStep(2); }}
                    className="py-2.5 px-6 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs flex items-center gap-2 transition"
                  >
                    <span>Next: Infrastructure</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-4">
                <h3 className="text-base font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-3">
                  <Building2 className="w-5 h-5 text-emerald-400" />
                  <span>Step 2: Infrastructure Configuration</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Number of Buildings / Towers</label>
                    <input
                      type="number"
                      name="buildingCount"
                      min={1}
                      value={formData.buildingCount}
                      onChange={handleChange}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-sm text-slate-100 focus:border-emerald-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Approximate Number of Flats</label>
                    <input
                      type="number"
                      name="flatCount"
                      min={1}
                      value={formData.flatCount}
                      onChange={handleChange}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-sm text-slate-100 focus:border-emerald-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="pt-4 flex justify-between">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="py-2.5 px-4 rounded-xl bg-slate-800 text-slate-300 font-bold text-xs flex items-center gap-2"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Back</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => { if (validateStep2()) setStep(3); }}
                    className="py-2.5 px-6 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs flex items-center gap-2"
                  >
                    <span>Next: Contact Details</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-4">
                <h3 className="text-base font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-3">
                  <UserCheck className="w-5 h-5 text-emerald-400" />
                  <span>Step 3: Representative / Secretary Contact Details</span>
                </h3>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Full Name of Secretary / President</label>
                  <input
                    type="text"
                    name="applicantName"
                    value={formData.applicantName}
                    onChange={handleChange}
                    placeholder="e.g. Rajesh Sharma"
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-sm text-slate-100 placeholder-slate-600 focus:border-emerald-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Official Email Address (Becomes Society Admin login)</label>
                  <input
                    type="email"
                    name="applicantEmail"
                    value={formData.applicantEmail}
                    onChange={handleChange}
                    placeholder="secretary@society.com"
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-sm text-slate-100 placeholder-slate-600 focus:border-emerald-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Contact Phone Number</label>
                  <input
                    type="tel"
                    name="applicantPhone"
                    value={formData.applicantPhone}
                    onChange={handleChange}
                    placeholder="+91 98000 00000"
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-sm text-slate-100 placeholder-slate-600 focus:border-emerald-500 focus:outline-none"
                  />
                </div>

                <div className="pt-4 flex justify-between">
                  <button
                    type="button"
                    onClick={() => setStep(2)}
                    className="py-2.5 px-4 rounded-xl bg-slate-800 text-slate-300 font-bold text-xs flex items-center gap-2"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Back</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => { if (validateStep3()) setStep(4); }}
                    className="py-2.5 px-6 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs flex items-center gap-2"
                  >
                    <span>Next: Documents & Review</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {step === 4 && (
              <div className="space-y-4">
                <h3 className="text-base font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-3">
                  <Upload className="w-5 h-5 text-emerald-400" />
                  <span>Step 4: Supporting Verification Documents</span>
                </h3>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Registration Certificate / Deed URL</label>
                  <input
                    type="text"
                    name="documentUrl"
                    value={formData.documentUrl}
                    onChange={handleChange}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-sm text-slate-100 focus:border-emerald-500 focus:outline-none"
                  />
                </div>

                {/* Summary card */}
                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs space-y-1.5 text-slate-300">
                  <p className="font-bold text-emerald-400 mb-1">Application Summary Confirmation:</p>
                  <p><span className="text-slate-500">Society:</span> {formData.societyName}</p>
                  <p><span className="text-slate-500">Registration:</span> {formData.registrationNumber}</p>
                  <p><span className="text-slate-500">Location:</span> {formData.city}, {formData.state} - {formData.pinCode}</p>
                  <p><span className="text-slate-500">Units:</span> {formData.buildingCount} Buildings, ~{formData.flatCount} Flats</p>
                  <p><span className="text-slate-500">Applicant:</span> {formData.applicantName} ({formData.applicantEmail})</p>
                </div>

                <div className="pt-4 flex justify-between">
                  <button
                    type="button"
                    onClick={() => setStep(3)}
                    className="py-2.5 px-4 rounded-xl bg-slate-800 text-slate-300 font-bold text-xs flex items-center gap-2"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Back</span>
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="py-2.5 px-8 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-extrabold text-xs transition shadow-lg shadow-emerald-500/20 disabled:opacity-50"
                  >
                    {loading ? 'Submitting Application...' : 'Submit Application to Super Admin'}
                  </button>
                </div>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};
