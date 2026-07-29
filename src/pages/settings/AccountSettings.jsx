import React from 'react';
import {  Key, Smartphone, Mail, AlertTriangle, ChevronRight, CheckCircle2 } from 'lucide-react';

export default function AccountSettings() {
  return (
    <div className="animate-in fade-in slide-in-from-right-4 duration-300 w-full pb-10">
      
      {/* Linked Accounts */}
      <div className="mb-8">
        <h2 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-4 px-2">Linked Accounts</h2>
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          
          <div className="p-4 flex items-center justify-between border-b border-gray-100 hover:bg-gray-50 cursor-pointer">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center shrink-0">
                <svg className="w-5 h-5 text-blue-600" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                </svg>
              </div>
              <div>
                <h3 className="font-bold text-gray-900">Google</h3>
                <p className="text-xs text-gray-500">Connected</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-green-500" />
            </div>
          </div>

          <div className="p-4 flex items-center justify-between hover:bg-gray-50 cursor-pointer">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center shrink-0">
                <svg className="w-5 h-5 text-blue-700" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.469h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.469h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </div>
              <div>
                <h3 className="font-bold text-gray-900">Facebook</h3>
                <p className="text-xs text-gray-500">Not connected</p>
              </div>
            </div>
            <button className="text-xs font-semibold text-blue-600 bg-blue-50 px-3 py-1.5 rounded-full hover:bg-blue-100 transition-colors">
              Connect
            </button>
          </div>

        </div>
      </div>

      {/* Sign-in & Security */}
      <div className="mb-8">
        <h2 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-4 px-2">Sign-in & Security</h2>
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          
          <div className="p-4 flex items-center justify-between border-b border-gray-100 hover:bg-gray-50 cursor-pointer">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-gray-50 rounded-full flex items-center justify-center shrink-0">
                <Smartphone className="w-5 h-5 text-gray-600" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900">Phone Number</h3>
                <p className="text-xs text-gray-500">+91 98765 43210</p>
              </div>
            </div>
            <button className="text-xs font-semibold text-green-600 hover:underline">Update</button>
          </div>

          <div className="p-4 flex items-center justify-between border-b border-gray-100 hover:bg-gray-50 cursor-pointer">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-gray-50 rounded-full flex items-center justify-center shrink-0">
                <Mail className="w-5 h-5 text-gray-600" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900">Email Address</h3>
                <p className="text-xs text-gray-500">ravi.kumar@example.com</p>
              </div>
            </div>
            <button className="text-xs font-semibold text-green-600 hover:underline">Update</button>
          </div>

          <div className="p-4 flex items-center justify-between hover:bg-gray-50 cursor-pointer">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-gray-50 rounded-full flex items-center justify-center shrink-0">
                <Key className="w-5 h-5 text-gray-600" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900">Password</h3>
                <p className="text-xs text-gray-500">Last changed 3 months ago</p>
              </div>
            </div>
            <div className="flex items-center text-sm font-bold text-gray-500">
              Change <ChevronRight className="w-4 h-4 ml-1" />
            </div>
          </div>

        </div>
      </div>

      {/* Account Deletion */}
      <div>
        <h2 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-4 px-2">Danger Zone</h2>
        <div className="bg-red-50 rounded-2xl p-4 border border-red-100 flex items-center justify-between cursor-pointer hover:bg-red-100/50 transition-colors">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center shrink-0 text-red-600">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-red-700">Delete Account</h3>
              <p className="text-xs text-red-600/80">Permanently delete your account and data</p>
            </div>
          </div>
          <ChevronRight className="w-5 h-5 text-red-400" />
        </div>
      </div>

    </div>
  );
}
