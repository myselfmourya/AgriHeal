-- Experts Directory
CREATE TABLE experts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL, -- if an expert is also a user
    name VARCHAR(255) NOT NULL,
    specialty VARCHAR(255) NOT NULL,
    experience_years INT NOT NULL,
    rating DECIMAL(2,1) CHECK (rating >= 0 AND rating <= 5),
    verified BOOLEAN DEFAULT false,
    profile_image_url TEXT,
    bio TEXT,
    language VARCHAR(100)[],
    hourly_rate DECIMAL(10,2),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Expert Availability
CREATE TABLE expert_availability (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    expert_id UUID REFERENCES experts(id) ON DELETE CASCADE,
    day_of_week INT CHECK (day_of_week BETWEEN 0 AND 6),
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    is_available BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Bookings / Consultations
CREATE TABLE bookings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    farmer_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    expert_id UUID REFERENCES experts(id) ON DELETE CASCADE,
    scheduled_at TIMESTAMP WITH TIME ZONE NOT NULL,
    duration_minutes INT DEFAULT 30,
    status VARCHAR(50) DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'completed', 'cancelled', 'no_show')),
    payment_status VARCHAR(50) DEFAULT 'pending',
    meeting_link TEXT, -- e.g., LiveKit room URL
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Consultation Notes
CREATE TABLE consultation_notes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    booking_id UUID REFERENCES bookings(id) ON DELETE CASCADE,
    expert_id UUID REFERENCES experts(id) ON DELETE CASCADE,
    farmer_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    notes TEXT,
    prescription TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Row Level Security (RLS)
ALTER TABLE experts ENABLE ROW LEVEL SECURITY;
ALTER TABLE expert_availability ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE consultation_notes ENABLE ROW LEVEL SECURITY;

-- Experts: anyone can view, only admins/themselves can edit (simplified for now)
CREATE POLICY "Experts are viewable by everyone" ON experts FOR SELECT USING (true);

-- Availability: viewable by everyone
CREATE POLICY "Availability viewable by everyone" ON expert_availability FOR SELECT USING (true);

-- Bookings: Farmers can view their own, experts can view theirs
CREATE POLICY "Users can view their own bookings" ON bookings FOR SELECT 
USING (auth.uid() = farmer_id OR auth.uid() IN (SELECT user_id FROM experts WHERE id = expert_id));

CREATE POLICY "Users can insert their own bookings" ON bookings FOR INSERT 
WITH CHECK (auth.uid() = farmer_id);

CREATE POLICY "Users can update their own bookings" ON bookings FOR UPDATE
USING (auth.uid() = farmer_id OR auth.uid() IN (SELECT user_id FROM experts WHERE id = expert_id));

-- Notes: Viewable by the specific farmer and the expert
CREATE POLICY "Users can view notes for their consultations" ON consultation_notes FOR SELECT 
USING (auth.uid() = farmer_id OR auth.uid() IN (SELECT user_id FROM experts WHERE id = expert_id));

CREATE POLICY "Experts can insert notes" ON consultation_notes FOR INSERT 
WITH CHECK (auth.uid() IN (SELECT user_id FROM experts WHERE id = expert_id));
