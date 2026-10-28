import { useState } from 'react'
import { motion } from 'framer-motion'
import { User, Sprout, PawPrint, Heart, Scroll, Shield } from 'lucide-react'
import { useVani, LANGS } from '../contexts/VaniContext'
import { useFarmer } from '../contexts/FarmerContext'
import { useNotification } from '../contexts/NotificationContext'
import { useVoiceActions } from '../hooks/useVoiceActions'

export default function Profile() {
  const { speak } = useVani()
  const { profile, updateProfile } = useFarmer()
  const { addNotification } = useNotification()
  
  const [activeTab, setActiveTab] = useState('personal')
  const [isEditing, setIsEditing] = useState(false)
  const [editForm, setEditForm] = useState({
    name: 'Ramesh Kumar',
    phone: '+91 9876543210',
    whatsapp: '+91 9876543210',
    email: 'ramesh@example.com',
    village: 'Palampur',
    district: 'Kangra',
    state: 'Himachal Pradesh',
    pin: '176061',
    language: 'hi',
    dob: '1975-05-15',
    gender: 'Male',
    emergency1: '9876543211',
    emergency2: '9876543212',
    farmName: 'Ramesh Farms',
    landSize: '4.5',
    surveyNumber: 'SV-1234',
    soilType: 'Loamy',
    waterSource: 'Borewell',
    activeCrops: profile?.crops || ['Wheat', 'Mustard'],
    irrigation: 'Drip',
    experience: '20',
    certifications: ['Organic (NPOP)'],
    ...profile
  })

  const handleSave = () => {
    updateProfile(editForm)
    setIsEditing(false)
    addNotification({ title: 'Profile Updated', message: 'Your profile has been saved successfully.', type: 'success' })
    speak('Profile updated successfully.')
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setEditForm(prev => ({ ...prev, [name]: value }))
  }

  const VOICE_PROFILE_FIELDS = ['name', 'phone', 'village', 'district', 'state', 'farmName', 'landSize', 'soilType', 'waterSource', 'irrigation', 'experience'];

  useVoiceActions([
    {
      id: 'profile.updateField',
      description: 'Update one field of the farmer\'s profile — does not save until profile.save is also called',
      params: { field: `one of: ${VOICE_PROFILE_FIELDS.join(', ')}`, value: 'the new value, as plain text' },
      destructive: false, // only edits the in-progress form; profile.save is the real submit
      handler: ({ field, value }) => {
        if (!VOICE_PROFILE_FIELDS.includes(field)) throw new Error(`I can't edit "${field}" — that's not a profile field I'm allowed to change.`);
        setIsEditing(true);
        setEditForm((prev) => ({ ...prev, [field]: value }));
        return `Set ${field} to ${value}. Say "save my profile" when you're done.`;
      },
    },
    {
      id: 'profile.save',
      description: 'Save the profile changes',
      params: {},
      destructive: true, // writes to the real farmers row
      handler: () => {
        handleSave();
        return 'Profile saved.';
      },
    },
  ], [editForm]);

  const tabs = [
    { id: 'personal', icon: User, label: 'Personal' },
    { id: 'farm', icon: Sprout, label: 'Farm' },
    { id: 'livestock', icon: PawPrint, label: 'Livestock' },
    { id: 'health', icon: Heart, label: 'Health' },
    { id: 'schemes', icon: Scroll, label: 'Schemes' },
    { id: 'security', icon: Shield, label: 'Security' }
  ]

  return (
    <div className="page-content">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="section-card p-6">
        <div className="flex flex-col md:flex-row gap-6 items-center md:items-start justify-between">
          <div className="flex flex-col md:flex-row gap-6 items-center">
            <div className="avatar-circle w-24 h-24 text-4xl bg-[var(--brand-green)] text-white flex items-center justify-center rounded-full">
              {editForm.name?.[0] || 'F'}
            </div>
            <div className="text-center md:text-left">
              <h2 className="text-2xl font-bold">{editForm.name}</h2>
              <p className="text-[var(--text-500)] mt-1">{editForm.village}, {editForm.district}</p>
              <div className="badge badge-green mt-2 inline-flex">✓ Verified Farmer</div>
            </div>
          </div>
          
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="flex flex-col items-center">
              <div className="relative w-16 h-16">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                  <circle cx="18" cy="18" r="16" fill="none" className="stroke-[var(--surface)]" strokeWidth="4" />
                  <circle cx="18" cy="18" r="16" fill="none" className="stroke-[var(--brand-green)]" strokeWidth="4" strokeDasharray="100 100" strokeDashoffset="18" />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center font-bold text-sm">82</div>
              </div>
              <span className="text-xs text-[var(--text-500)] mt-1">Safety Score</span>
            </div>
            <div className="flex gap-2">
              {isEditing ? (
                <>
                  <button className="btn-ghost" onClick={() => setIsEditing(false)}>Cancel</button>
                  <button className="btn-primary" onClick={handleSave}>Save</button>
                </>
              ) : (
                <button className="btn-secondary" onClick={() => setIsEditing(true)}>Edit Profile</button>
              )}
            </div>
          </div>
        </div>
      </motion.div>

      <div className="tab-bar mt-6 flex overflow-x-auto border-b border-[var(--border)]">
        {tabs.map(t => (
          <button 
            key={t.id} 
            className={`tab-btn px-4 py-2 border-b-2 whitespace-nowrap ${activeTab === t.id ? 'border-[var(--brand-green)] text-[var(--brand-green)] font-semibold' : 'border-transparent text-[var(--text-500)]'}`} 
            onClick={() => { setActiveTab(t.id); speak(`Opened ${t.label.split(' ')[1]} tab`) }}
          >
            <t.icon className="w-4 h-4 mr-2 inline-block mb-1" />
            {t.label}
          </button>
        ))}
      </div>

      <motion.div 
        key={activeTab}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        className="mt-6"
      >
        {activeTab === 'personal' && (
          <div className="section-card p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="flex flex-col gap-4">
                <h3 className="section-title border-b border-[var(--border)] pb-2">Basic Information</h3>
                <div>
                  <label className="text-sm text-[var(--text-500)]">Full Name</label>
                  <input name="name" value={editForm.name || ''} onChange={handleChange} disabled={!isEditing} className="w-full p-2 rounded-md bg-[var(--surface)] border border-[var(--border)] mt-1 disabled:opacity-75" />
                </div>
                <div>
                  <label className="text-sm text-[var(--text-500)]">Date of Birth</label>
                  <input type="date" name="dob" value={editForm.dob || ''} onChange={handleChange} disabled={!isEditing} className="w-full p-2 rounded-md bg-[var(--surface)] border border-[var(--border)] mt-1 disabled:opacity-75" />
                </div>
                <div>
                  <label className="text-sm text-[var(--text-500)]">Gender</label>
                  <select name="gender" value={editForm.gender || 'Male'} onChange={handleChange} disabled={!isEditing} className="w-full p-2 rounded-md bg-[var(--surface)] border border-[var(--border)] mt-1 disabled:opacity-75">
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm text-[var(--text-500)]">Preferred Language</label>
                  <select name="language" value={editForm.language || 'en'} onChange={handleChange} disabled={!isEditing} className="w-full p-2 rounded-md bg-[var(--surface)] border border-[var(--border)] mt-1 disabled:opacity-75">
                    {LANGS ? LANGS.map((lang) => (
                      <option key={lang.code} value={lang.code}>{lang.label}</option>
                    )) : (
                      <>
                        <option value="hi">Hindi</option>
                        <option value="en">English</option>
                        <option value="te">Telugu</option>
                        <option value="ta">Tamil</option>
                        <option value="mr">Marathi</option>
                      </>
                    )}
                  </select>
                </div>
              </div>

              <div className="flex flex-col gap-4">
                <h3 className="section-title border-b border-[var(--border)] pb-2">Contact & Location</h3>
                <div>
                  <label className="text-sm text-[var(--text-500)]">Phone Number</label>
                  <input name="phone" value={editForm.phone || ''} onChange={handleChange} disabled={!isEditing} className="w-full p-2 rounded-md bg-[var(--surface)] border border-[var(--border)] mt-1 disabled:opacity-75" />
                </div>
                <div>
                  <label className="text-sm text-[var(--text-500)]">WhatsApp Number</label>
                  <input name="whatsapp" value={editForm.whatsapp || ''} onChange={handleChange} disabled={!isEditing} className="w-full p-2 rounded-md bg-[var(--surface)] border border-[var(--border)] mt-1 disabled:opacity-75" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm text-[var(--text-500)]">Village</label>
                    <input name="village" value={editForm.village || ''} onChange={handleChange} disabled={!isEditing} className="w-full p-2 rounded-md bg-[var(--surface)] border border-[var(--border)] mt-1 disabled:opacity-75" />
                  </div>
                  <div>
                    <label className="text-sm text-[var(--text-500)]">District</label>
                    <input name="district" value={editForm.district || ''} onChange={handleChange} disabled={!isEditing} className="w-full p-2 rounded-md bg-[var(--surface)] border border-[var(--border)] mt-1 disabled:opacity-75" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm text-[var(--text-500)]">State</label>
                    <input name="state" value={editForm.state || ''} onChange={handleChange} disabled={!isEditing} className="w-full p-2 rounded-md bg-[var(--surface)] border border-[var(--border)] mt-1 disabled:opacity-75" />
                  </div>
                  <div>
                    <label className="text-sm text-[var(--text-500)]">PIN Code</label>
                    <input name="pin" value={editForm.pin || ''} onChange={handleChange} disabled={!isEditing} className="w-full p-2 rounded-md bg-[var(--surface)] border border-[var(--border)] mt-1 disabled:opacity-75" />
                  </div>
                </div>
                <div className="mt-2 pt-4 border-t border-[var(--border)]">
                  <h4 className="font-semibold mb-2">Emergency Contacts</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <input name="emergency1" value={editForm.emergency1 || ''} onChange={handleChange} disabled={!isEditing} placeholder="Contact 1" className="w-full p-2 rounded-md bg-[var(--surface)] border border-[var(--border)] disabled:opacity-75" />
                    <input name="emergency2" value={editForm.emergency2 || ''} onChange={handleChange} disabled={!isEditing} placeholder="Contact 2" className="w-full p-2 rounded-md bg-[var(--surface)] border border-[var(--border)] disabled:opacity-75" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'farm' && (
          <div className="section-card p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="flex flex-col gap-4">
                <h3 className="section-title border-b border-[var(--border)] pb-2">Farm Details</h3>
                <div>
                  <label className="text-sm text-[var(--text-500)]">Farm Name</label>
                  <input name="farmName" value={editForm.farmName || ''} onChange={handleChange} disabled={!isEditing} className="w-full p-2 rounded-md bg-[var(--surface)] border border-[var(--border)] mt-1" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm text-[var(--text-500)]">Land Size (Acres)</label>
                    <input type="number" name="landSize" value={editForm.landSize || ''} onChange={handleChange} disabled={!isEditing} className="w-full p-2 rounded-md bg-[var(--surface)] border border-[var(--border)] mt-1" />
                  </div>
                  <div>
                    <label className="text-sm text-[var(--text-500)]">Survey Number</label>
                    <input name="surveyNumber" value={editForm.surveyNumber || ''} onChange={handleChange} disabled={!isEditing} className="w-full p-2 rounded-md bg-[var(--surface)] border border-[var(--border)] mt-1" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm text-[var(--text-500)]">Soil Type</label>
                    <select name="soilType" value={editForm.soilType || 'Loamy'} onChange={handleChange} disabled={!isEditing} className="w-full p-2 rounded-md bg-[var(--surface)] border border-[var(--border)] mt-1">
                      <option value="Loamy">Loamy</option>
                      <option value="Clay">Clay</option>
                      <option value="Sandy">Sandy</option>
                      <option value="Silt">Silt</option>
                      <option value="Black">Black Soil</option>
                      <option value="Red">Red Soil</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-sm text-[var(--text-500)]">Water Source</label>
                    <select name="waterSource" value={editForm.waterSource || 'Borewell'} onChange={handleChange} disabled={!isEditing} className="w-full p-2 rounded-md bg-[var(--surface)] border border-[var(--border)] mt-1">
                      <option value="Borewell">Borewell</option>
                      <option value="Canal">Canal</option>
                      <option value="Rainfed">Rainfed</option>
                      <option value="River">River</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="text-sm text-[var(--text-500)]">Irrigation Method</label>
                  <select name="irrigation" value={editForm.irrigation || 'Drip'} onChange={handleChange} disabled={!isEditing} className="w-full p-2 rounded-md bg-[var(--surface)] border border-[var(--border)] mt-1">
                    <option value="Drip">Drip Irrigation</option>
                    <option value="Sprinkler">Sprinkler</option>
                    <option value="Flood">Flood Irrigation</option>
                  </select>
                </div>
              </div>

              <div className="flex flex-col gap-4">
                <h3 className="section-title border-b border-[var(--border)] pb-2">Crops & Location</h3>
                <div>
                  <label className="text-sm text-[var(--text-500)]">Active Crops</label>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {(editForm.activeCrops || []).map(crop => (
                      <div key={crop} className="badge badge-blue">{crop} {isEditing && <span className="ml-2 cursor-pointer">×</span>}</div>
                    ))}
                    {isEditing && <button className="badge badge-gray border border-dashed">+ Add Crop</button>}
                  </div>
                </div>
                <div className="mt-4">
                  <label className="text-sm text-[var(--text-500)]">Farm Location</label>
                  <div className="flex items-center gap-4 mt-1">
                    <div className="p-2 bg-[var(--surface)] border border-[var(--border)] rounded-md flex-1 text-sm font-mono">
                      Lat: {editForm.lat || '32.1123'}, Lon: {editForm.lon || '76.5432'}
                    </div>
                    {isEditing && <button className="btn-secondary whitespace-nowrap" onClick={() => speak('Getting GPS location')}>Use GPS</button>}
                  </div>
                </div>
                <div className="mt-4">
                  <label className="text-sm text-[var(--text-500)]">Farming Experience (Years)</label>
                  <input type="number" name="experience" value={editForm.experience || ''} onChange={handleChange} disabled={!isEditing} className="w-full p-2 rounded-md bg-[var(--surface)] border border-[var(--border)] mt-1" />
                </div>
                <div className="mt-4">
                  <label className="text-sm text-[var(--text-500)]">Certifications</label>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {(editForm.certifications || []).map(cert => (
                      <div key={cert} className="badge badge-green">{cert}</div>
                    ))}
                    {isEditing && <button className="badge badge-gray border border-dashed">+ Add Cert</button>}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'livestock' && (
          <div className="flex flex-col gap-4">
            <div className="grid grid-cols-3 gap-4">
              <div className="stat-card bg-[var(--surface)] p-4 rounded-xl shadow-sm text-center">
                <div className="text-2xl font-bold text-[var(--text-900)]">12</div>
                <div className="text-sm text-[var(--text-500)]">Total Animals</div>
              </div>
              <div className="stat-card bg-[var(--surface)] p-4 rounded-xl shadow-sm text-center">
                <div className="text-2xl font-bold text-[var(--brand-green)]">10</div>
                <div className="text-sm text-[var(--text-500)]">Healthy</div>
              </div>
              <div className="stat-card bg-[var(--surface)] p-4 rounded-xl shadow-sm text-center">
                <div className="text-2xl font-bold text-[var(--brand-violet)]">2</div>
                <div className="text-sm text-[var(--text-500)]">Pending Vaccines</div>
              </div>
            </div>
            
            <div className="section-card p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="section-title">Animal Profiles</h3>
                <button className="btn-ghost text-[var(--brand-blue)]" onClick={() => speak('Navigating to livestock monitor')}>Go to Livestock Monitor →</button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { id: 'TAG-101', name: 'Gauri', species: 'Cow', age: '4 yrs', status: 'Healthy' },
                  { id: 'TAG-102', name: 'Nandi', species: 'Bull', age: '3 yrs', status: 'Vaccination Due' }
                ].map(animal => (
                  <div key={animal.id} className="card p-4 flex gap-4 items-center bg-[var(--surface)] border border-[var(--border)] rounded-lg">
                    <div className="w-12 h-12 rounded-full bg-[var(--bg)] flex items-center justify-center text-[var(--brand-green)]"><PawPrint className="w-6 h-6" /></div>
                    <div>
                      <h4 className="font-bold">{animal.name}</h4>
                      <p className="text-sm text-[var(--text-500)]">{animal.species} • {animal.age} • {animal.id}</p>
                    </div>
                    <div className={`ml-auto badge ${animal.status === 'Healthy' ? 'badge-green' : 'badge-amber'}`}>
                      {animal.status}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'health' && (
          <div className="section-card p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="flex flex-col gap-4">
                <h3 className="section-title border-b border-[var(--border)] pb-2">Personal Health</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm text-[var(--text-500)]">Blood Group</label>
                    <div className="p-2 bg-[var(--surface)] border border-[var(--border)] rounded-md mt-1 font-semibold text-[var(--brand-blue)]">O+</div>
                  </div>
                  <div>
                    <label className="text-sm text-[var(--text-500)]">Last Checkup</label>
                    <div className="p-2 bg-[var(--surface)] border border-[var(--border)] rounded-md mt-1">15 Jan 2024</div>
                  </div>
                </div>
                <div>
                  <label className="text-sm text-[var(--text-500)]">Allergies</label>
                  <div className="p-2 bg-[var(--surface)] border border-[var(--border)] rounded-md mt-1">Pollen, Dust</div>
                </div>
                <div>
                  <label className="text-sm text-[var(--text-500)]">Chronic Conditions</label>
                  <div className="p-2 bg-[var(--surface)] border border-[var(--border)] rounded-md mt-1">None reported</div>
                </div>
              </div>

              <div className="flex flex-col gap-4">
                <h3 className="section-title border-b border-[var(--border)] pb-2">Health Insurance & Family</h3>
                <div>
                  <label className="text-sm text-[var(--text-500)]">Ayushman Card Number</label>
                  <div className="flex items-center gap-2">
                    <div className="p-2 bg-[var(--surface)] border border-[var(--border)] rounded-md mt-1 flex-1 font-mono">XXXX-XXXX-1234</div>
                    <div className="badge badge-green mt-1">Active</div>
                  </div>
                </div>
                <div className="mt-4">
                  <h4 className="font-semibold text-sm text-[var(--text-500)] mb-2">Family Members</h4>
                  <div className="flex flex-col gap-2">
                    <div className="p-3 bg-[var(--surface)] border border-[var(--border)] rounded-lg flex justify-between items-center">
                      <div>
                        <div className="font-medium">Sita Devi</div>
                        <div className="text-xs text-[var(--text-500)]">Wife • 42 yrs</div>
                      </div>
                      <div className="badge badge-green">Healthy</div>
                    </div>
                    <div className="p-3 bg-[var(--surface)] border border-[var(--border)] rounded-lg flex justify-between items-center">
                      <div>
                        <div className="font-medium">Rahul Kumar</div>
                        <div className="text-xs text-[var(--text-500)]">Son • 18 yrs</div>
                      </div>
                      <div className="badge badge-green">Healthy</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'schemes' && (
          <div className="section-card flex flex-col gap-4">
            <div className="flex justify-between items-center">
              <h3 className="section-title">My Schemes & Benefits</h3>
              <button className="btn-primary" onClick={() => speak('Navigating to schemes finder')}>Find More Schemes</button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
              <div className="scheme-card p-4 border border-[var(--brand-green)] bg-[var(--surface)] rounded-xl relative overflow-hidden">
                <div className="absolute top-0 right-0 bg-[var(--brand-green)] text-white px-3 py-1 text-xs font-bold rounded-bl-lg">ACTIVE</div>
                <h4 className="font-bold text-lg mb-1 mt-2">PM-KISAN</h4>
                <p className="text-sm text-[var(--text-500)] mb-3">Pradhan Mantri Kisan Samman Nidhi</p>
                <div className="flex justify-between text-sm">
                  <span className="text-[var(--text-500)]">Next Installment:</span>
                  <span className="font-semibold">Oct 2024</span>
                </div>
              </div>
              
              <div className="scheme-card p-4 border border-[var(--brand-blue)] bg-[var(--surface)] rounded-xl relative overflow-hidden">
                <div className="absolute top-0 right-0 bg-[var(--brand-blue)] text-white px-3 py-1 text-xs font-bold rounded-bl-lg">ACTIVE</div>
                <h4 className="font-bold text-lg mb-1 mt-2">PMFBY</h4>
                <p className="text-sm text-[var(--text-500)] mb-3">Pradhan Mantri Fasal Bima Yojana</p>
                <div className="flex justify-between text-sm">
                  <span className="text-[var(--text-500)]">Renewal Date:</span>
                  <span className="font-semibold">15 Dec 2024</span>
                </div>
              </div>
            </div>

            <h4 className="font-semibold mt-6 mb-2">Recent Benefits Received</h4>
            <div className="admin-table w-full text-left border-collapse">
              <div className="bg-[var(--bg)] rounded-t-lg">
                <div className="grid grid-cols-3 p-3 font-semibold text-sm text-[var(--text-500)]">
                  <div>Date</div>
                  <div>Scheme</div>
                  <div>Amount / Benefit</div>
                </div>
              </div>
              <div className="border border-[var(--border)] border-t-0 rounded-b-lg">
                <div className="grid grid-cols-3 p-3 border-b border-[var(--border)] text-sm items-center">
                  <div>12 Aug 2024</div>
                  <div>PM-KISAN</div>
                  <div className="font-semibold text-[var(--brand-green)]">₹2,000</div>
                </div>
                <div className="grid grid-cols-3 p-3 text-sm items-center">
                  <div>05 May 2024</div>
                  <div>KCC Loan Subsidy</div>
                  <div className="font-semibold text-[var(--brand-green)]">₹4,500</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'security' && (
          <div className="section-card p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="flex flex-col gap-4">
                <h3 className="section-title border-b border-[var(--border)] pb-2">Authentication</h3>
                <div>
                  <label className="text-sm text-[var(--text-500)]">Current PIN</label>
                  <input type="password" placeholder="****" className="w-full p-2 rounded-md bg-[var(--surface)] border border-[var(--border)] mt-1" />
                </div>
                <div>
                  <label className="text-sm text-[var(--text-500)]">New PIN</label>
                  <input type="password" placeholder="****" className="w-full p-2 rounded-md bg-[var(--surface)] border border-[var(--border)] mt-1" />
                </div>
                <button className="btn-secondary w-full mt-2">Update PIN</button>

                <div className="mt-4 flex items-center justify-between border-t border-[var(--border)] pt-4">
                  <div>
                    <div className="font-medium">Biometric Login</div>
                    <div className="text-xs text-[var(--text-500)]">Use fingerprint or face unlock</div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" defaultChecked />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[var(--brand-green)]"></div>
                  </label>
                </div>
              </div>

              <div className="flex flex-col gap-4">
                <h3 className="section-title border-b border-[var(--border)] pb-2">Privacy & Data</h3>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">Share Diagnostic Data</div>
                    <div className="text-xs text-[var(--text-500)]">Help improve AgriHeal</div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" defaultChecked />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[var(--brand-green)]"></div>
                  </label>
                </div>
                
                <div className="mt-4 pt-4 border-t border-[var(--border)]">
                  <h4 className="font-semibold text-sm mb-2">Login History</h4>
                  <div className="text-xs text-[var(--text-500)] flex flex-col gap-2">
                    <div className="flex justify-between"><span>Today, 10:30 AM</span><span>Mobile App (Android)</span></div>
                    <div className="flex justify-between"><span>Yesterday, 04:15 PM</span><span>Web Portal (Chrome)</span></div>
                  </div>
                </div>

                <div className="mt-8 pt-4 border-t border-[var(--border)]">
                  <button className="w-full p-2 text-red-500 font-medium border border-red-200 rounded-md bg-red-50 opacity-50 cursor-not-allowed">
                    Delete Account
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  )
}
