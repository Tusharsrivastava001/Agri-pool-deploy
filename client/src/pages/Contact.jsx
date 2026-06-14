import React, { useState } from 'react';
import api from '../utils/api';
import { Mail, Phone, MapPin, Send, MessageSquare, User, AtSign, Bookmark } from 'lucide-react';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [status, setStatus] = useState({ loading: false, message: '', type: '' });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ loading: true, message: '', type: '' });

    try {
      const res = await api.post("/api/contact/submit", formData);
      if (res.data.success) {
        setStatus({ loading: false, message: "Message sent! We'll get back to you soon.", type: 'success' });
        setFormData({ name: '', email: '', subject: '', message: '' });
      }
    } catch {
      setStatus({ loading: false, message: "Oops! Something went wrong. Try again.", type: 'error' });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-28 pb-12 px-4 md:px-8">
      <div className="max-w-6xl mx-auto bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row border border-gray-100">
        
        {/* LEFT SIDE: CONTACT INFO (Emerald Gradient) */}
        <div className="md:w-1/3 bg-gradient-to-br from-emerald-800 to-emerald-950 p-8 md:p-12 text-white relative">
          <div className="relative z-10">
            <h2 className="text-3xl font-bold mb-6">Get in Touch</h2>
            <p className="text-emerald-100 mb-10 leading-relaxed">
              Have questions about transport pooling or your fertilizer plan? Our team is here to help farmers grow better.
            </p>

            <div className="space-y-8">
              <div className="flex items-start gap-4">
                <div className="bg-emerald-700/50 p-3 rounded-lg border border-emerald-500/30">
                  <Mail className="w-6 h-6 text-emerald-300" />
                </div>
                <div>
                  <p className="text-sm text-emerald-300 font-semibold uppercase tracking-wider">Email Us</p>
                  <p className="text-lg">support@agripool.com</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="bg-emerald-700/50 p-3 rounded-lg border border-emerald-500/30">
                  <Phone className="w-6 h-6 text-emerald-300" />
                </div>
                <div>
                  <p className="text-sm text-emerald-300 font-semibold uppercase tracking-wider">Call Support</p>
                  <p className="text-lg">+91 98765 43210</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="bg-emerald-700/50 p-3 rounded-lg border border-emerald-500/30">
                  <MapPin className="w-6 h-6 text-emerald-300" />
                </div>
                <div>
                  <p className="text-sm text-emerald-300 font-semibold uppercase tracking-wider">Location</p>
                  <p className="text-lg">Agri-Tech Park, Sector 45<br/>Amritsar, Punjab</p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Abstract background shapes */}
          <div className="absolute bottom-0 right-0 opacity-10 pointer-events-none">
             <MessageSquare className="w-64 h-64 -mb-10 -mr-10 rotate-12" />
          </div>
        </div>

        {/* RIGHT SIDE: FORM */}
        <div className="md:w-2/3 p-8 md:p-12 bg-white">
          <h3 className="text-2xl font-bold text-gray-800 mb-2">Send us a Message</h3>
          <p className="text-gray-500 mb-8">Fields marked with * are required.</p>

          {status.message && (
            <div className={`mb-6 p-4 rounded-xl text-sm font-medium ${
              status.type === 'success' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : 'bg-red-50 text-red-700 border border-red-100'
            }`}>
              {status.message}
            </div>
          )}

          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700 flex items-center gap-2">
                <User size={16} className="text-emerald-600" /> Full Name *
              </label>
              <input
                type="text"
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter your name"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 outline-none transition-all"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700 flex items-center gap-2">
                <AtSign size={16} className="text-emerald-600" /> Email Address *
              </label>
              <input
                type="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                placeholder="name@farm.com"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 outline-none transition-all"
              />
            </div>

            <div className="md:col-span-2 space-y-2">
              <label className="text-sm font-bold text-gray-700 flex items-center gap-2">
                <Bookmark size={16} className="text-emerald-600" /> Subject
              </label>
              <input
                type="text"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                placeholder="How can we help?"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 outline-none transition-all"
              />
            </div>

            <div className="md:col-span-2 space-y-2">
              <label className="text-sm font-bold text-gray-700 flex items-center gap-2">
                <MessageSquare size={16} className="text-emerald-600" /> Your Message *
              </label>
              <textarea
                name="message"
                required
                rows="4"
                value={formData.message}
                onChange={handleChange}
                placeholder="Tell us about your requirements..."
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 outline-none transition-all resize-none"
              ></textarea>
            </div>

            <div className="md:col-span-2 pt-4">
              <button
                type="submit"
                disabled={status.loading}
                className="w-full md:w-auto bg-orange-500 hover:bg-orange-600 text-white px-10 py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-2 shadow-lg shadow-orange-500/30 transition-all transform active:scale-95 disabled:opacity-70"
              >
                {status.loading ? 'Sending...' : 'Send Message'}
                {!status.loading && <Send size={20} />}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Contact;
