import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { 
  Stethoscope, Star, Clock, Languages, Video, 
  Calendar, CheckCircle2, Search, X, ShieldCheck 
} from 'lucide-react';
import { expertsService } from '../services/expertsService';
import LoadingState from '../components/ui/LoadingState';

export default function ExpertsPage() {
  const [experts, setExperts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Booking Modal State
  const [selectedExpert, setSelectedExpert] = useState(null);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [isBooking, setIsBooking] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(null);

  // My Consultations
  const [myBookings, setMyBookings] = useState([]);

  useEffect(() => {
    const fetchExperts = async () => {
      setIsLoading(true);
      try {
        const data = await expertsService.getExperts();
        setExperts(data);
      } catch (error) {
        console.error("Failed to fetch experts:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchExperts();
  }, []);

  const handleBookSlot = async () => {
    if (!selectedExpert || !selectedSlot) return;
    setIsBooking(true);
    try {
      const result = await expertsService.bookConsultation(selectedExpert.id, selectedSlot);
      setBookingSuccess(result);
      setMyBookings(prev => [result, ...prev]);
    } catch (error) {
      console.error("Booking failed:", error);
      toast.error("Failed to book consultation. Please try again.");
    } finally {
      setIsBooking(false);
    }
  };

  const closeBookingModal = () => {
    setSelectedExpert(null);
    setSelectedSlot(null);
    setBookingSuccess(null);
    setIsBooking(false);
  };

  const filteredExperts = experts.filter(e => 
    e.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    e.specialty.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center p-6 min-h-screen">
        <LoadingState 
          message="Loading Expert Directory..." 
          subMessage="Fetching top agricultural specialists"
        />
      </div>
    );
  }

  return (
    <div className="pb-24 bg-[#f4f7f5] min-h-screen relative">
      
      {/* Header */}
      <div className="bg-white px-4 sm:px-6 py-4 border-b border-gray-100 z-30 shadow-sm sticky top-0">
        <h1 className="text-xl sm:text-2xl font-black text-slate-800 tracking-tight flex items-center gap-2">
          <Stethoscope className="w-6 h-6 text-green-600" /> Expert Tele-consultations
        </h1>
        <p className="text-xs text-slate-500 mt-1">Book video calls with certified Agronomists, Vets, and Soil Scientists.</p>
      </div>

      <div className="p-4 sm:p-6 max-w-7xl mx-auto space-y-8">
        
        {/* Upcoming Consultations Banner */}
        {myBookings.length > 0 && (
          <div className="bg-green-50 rounded-3xl p-5 border border-green-100 shadow-sm animate-fade-in">
            <h3 className="font-black text-green-800 flex items-center gap-2 mb-4">
              <Video className="w-5 h-5" /> Upcoming Consultations
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {myBookings.map(bkg => (
                <div key={bkg.bookingId} className="bg-white rounded-2xl p-4 shadow-sm border border-green-100">
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-[10px] font-bold bg-green-100 text-green-700 px-2 py-0.5 rounded-full">CONFIRMED</span>
                    <span className="text-[10px] text-slate-400">ID: {bkg.bookingId}</span>
                  </div>
                  <p className="font-black text-slate-800 text-sm">{bkg.expertName}</p>
                  <p className="text-xs font-bold text-slate-500 flex items-center gap-1 mt-1">
                    <Clock className="w-3.5 h-3.5" /> {bkg.slot}
                  </p>
                  <button className="w-full mt-3 bg-green-600 hover:bg-green-700 text-white py-2 rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-2 shadow-sm">
                    <Video className="w-3.5 h-3.5" /> Join Video Call
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Directory Header & Search */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h2 className="text-lg font-black text-slate-800 flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-blue-500" /> Verified Experts Directory
          </h2>
          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input 
              type="text"
              placeholder="Search by name or specialty..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-white border border-gray-200 rounded-xl py-2 pl-9 pr-4 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all shadow-sm"
            />
          </div>
        </div>

        {/* Expert Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredExperts.map(expert => (
            <div key={expert.id} className="bg-white rounded-3xl p-5 border border-gray-100 shadow-sm hover:shadow-md hover:border-green-200 transition-all flex flex-col group">
              <div className="flex items-start gap-4 mb-4">
                <img src={expert.image} alt={expert.name} className="w-16 h-16 rounded-2xl object-cover border-2 border-gray-50 shadow-sm group-hover:scale-105 transition-transform" />
                <div>
                  <h3 className="font-black text-slate-800 text-sm leading-tight">{expert.name}</h3>
                  <p className="text-[10px] font-bold text-green-600 uppercase mt-0.5">{expert.specialty}</p>
                  <p className="text-[10px] text-slate-500 font-medium mt-1">{expert.experience}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-4 text-xs mb-4">
                <span className="flex items-center gap-1 font-bold text-slate-700">
                  <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" /> {expert.rating} 
                  <span className="text-slate-400 font-medium">({expert.reviews})</span>
                </span>
                <span className="flex items-center gap-1 font-bold text-slate-700">
                  <Languages className="w-3.5 h-3.5 text-blue-500" /> {expert.languages.length} Langs
                </span>
              </div>
              
              <div className="mt-auto pt-4 border-t border-gray-50 flex items-center justify-between">
                <div>
                  <p className="text-[10px] text-slate-500 font-medium">Consultation Fee</p>
                  <p className="text-sm font-black text-slate-800">₹{expert.fee}</p>
                </div>
                <button 
                  onClick={() => setSelectedExpert(expert)}
                  className="bg-green-50 text-green-700 hover:bg-green-600 hover:text-white px-4 py-2 rounded-xl text-xs font-bold transition-colors shadow-sm"
                >
                  Book Slot
                </button>
              </div>
            </div>
          ))}
        </div>
        
        {filteredExperts.length === 0 && (
          <div className="text-center py-12 bg-white rounded-3xl border border-dashed border-gray-200">
            <Stethoscope className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-sm font-bold text-slate-500">No experts found matching your search.</p>
          </div>
        )}

      </div>

      {/* Booking Modal */}
      {selectedExpert && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl w-full max-w-md overflow-hidden shadow-2xl animate-scale-up">
            
            {/* Header */}
            <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
              <h3 className="font-black text-slate-800 text-lg">Book Consultation</h3>
              <button onClick={closeBookingModal} className="p-1.5 hover:bg-gray-200 rounded-full transition-colors"><X className="w-5 h-5"/></button>
            </div>

            {bookingSuccess ? (
              <div className="p-8 text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle2 className="w-8 h-8 text-green-600" />
                </div>
                <h4 className="text-lg font-black text-slate-800 mb-2">Booking Confirmed!</h4>
                <p className="text-sm text-slate-600 mb-6">Your video consultation with {bookingSuccess.expertName} is scheduled for <strong>{bookingSuccess.slot}</strong>.</p>
                <button 
                  onClick={closeBookingModal}
                  className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-xl text-sm font-bold shadow-sm transition-colors"
                >
                  View My Consultations
                </button>
              </div>
            ) : (
              <div className="p-5">
                <div className="flex items-center gap-4 mb-6">
                  <img src={selectedExpert.image} alt={selectedExpert.name} className="w-14 h-14 rounded-2xl object-cover shadow-sm" />
                  <div>
                    <h4 className="font-black text-slate-800 text-base">{selectedExpert.name}</h4>
                    <p className="text-xs font-bold text-green-600">{selectedExpert.specialty}</p>
                    <p className="text-xs text-slate-500 mt-0.5">Fee: ₹{selectedExpert.fee} / session</p>
                  </div>
                </div>

                <div className="mb-6">
                  <h5 className="text-xs font-bold text-slate-800 mb-3 flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-blue-500" /> Available Time Slots
                  </h5>
                  <div className="grid grid-cols-2 gap-2">
                    {selectedExpert.availability.map(slot => (
                      <button 
                        key={slot}
                        onClick={() => setSelectedSlot(slot)}
                        className={`py-2 px-3 rounded-xl text-xs font-bold transition-all border ${
                          selectedSlot === slot 
                            ? 'bg-green-50 border-green-500 text-green-700 shadow-sm' 
                            : 'bg-white border-gray-200 text-slate-600 hover:border-green-300'
                        }`}
                      >
                        {slot}
                      </button>
                    ))}
                  </div>
                </div>

                <button 
                  onClick={handleBookSlot}
                  disabled={!selectedSlot || isBooking}
                  className={`w-full py-3 rounded-xl text-sm font-bold shadow-sm transition-all flex items-center justify-center gap-2 ${
                    !selectedSlot || isBooking
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      : 'bg-green-600 hover:bg-green-700 text-white'
                  }`}
                >
                  {isBooking ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Processing...
                    </>
                  ) : (
                    `Pay ₹${selectedExpert.fee} & Book`
                  )}
                </button>
                <p className="text-[10px] text-center text-slate-400 mt-3 flex items-center justify-center gap-1">
                  <ShieldCheck className="w-3 h-3" /> Secure Payment & Verified Expert
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
