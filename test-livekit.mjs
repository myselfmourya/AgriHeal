import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://brsexokmoaqkocwexvqf.supabase.co';
const supabaseAnonKey = 'sb_publishable_5oC6di8xE1o-V5ZrUqA4UA_XQdoD3rp';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testLivekit() {
    console.log('Signing in anonymously...');
    const { data: authData, error: authError } = await supabase.auth.signInAnonymously();
    if (authError) {
        console.error('Failed to sign in:', authError);
        return;
    }
    
    console.log('User ID:', authData.user.id);
    console.log('Invoking livekit-token...');
    
    const { data, error } = await supabase.functions.invoke('livekit-token', {
        body: { roomName: 'test-room', participantName: 'TestUser' }
    });
    
    if (error) {
        console.error('LiveKit Token Error:', error);
    } else {
        console.log('Success! Token:', data.token);
    }
}

testLivekit();
