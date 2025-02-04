import React from "react";
import { Mail, Phone, MapPin, Github, Linkedin, Twitter } from "lucide-react";

const ContactUs = () => {
  return (
    <div id="contact" className="min-h-screen">
      <div className="max-w-6xl mx-auto p-6">
        <div className="grid md:grid-cols-2 gap-8">
          {/* Contact Form */}
          <div className="bg-[#3B0764] p-8 rounded-lg">
            <h2 className="text-2xl font-bold text-white mb-6">Get in Touch</h2>
            <form className="space-y-6">
              <div>
                <label className="block text-white mb-2">Name</label>
                <input
                  type="text"
                  className="w-full bg-white/10 text-white p-3 rounded-lg border border-white/20 focus:outline-none focus:border-white/40"
                />
              </div>
              <div>
                <label className="block text-white mb-2">Email</label>
                <input
                  type="email"
                  className="w-full bg-white/10 text-white p-3 rounded-lg border border-white/20 focus:outline-none focus:border-white/40"
                />
              </div>
              <div>
                <label className="block text-white mb-2">Message</label>
                <textarea className="w-full bg-white/10 text-white p-3 rounded-lg border border-white/20 focus:outline-none focus:border-white/40 h-32"></textarea>
              </div>
              <button className="w-full bg-[#4A044E] text-white py-3 rounded-lg hover:bg-[#4A044E]/80">
                Send Message
              </button>
            </form>
          </div>

          {/* Contact Information */}
          <div className="space-y-6">
            <div className="bg-[#4A044E] p-6 rounded-lg">
              <h2 className="text-xl font-bold text-white mb-4">
                Contact Information
              </h2>
              <div className="space-y-4 text-white">
                <div className="flex items-center space-x-3">
                  <Mail className="w-5 h-5" />
                  <span>contact@ainewsanchor.com</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Phone className="w-5 h-5" />
                  <span>+1 (555) 123-4567</span>
                </div>
                <div className="flex items-center space-x-3">
                  <MapPin className="w-5 h-5" />
                  <span>123 Tech Avenue, Innovation City</span>
                </div>
              </div>
            </div>

            {/* Social Links */}
            <div className="bg-[#4A044E] p-6 rounded-lg">
              <h2 className="text-xl font-bold text-white mb-4">
                Connect With Us
              </h2>
              <div className="flex space-x-4">
                <a
                  href="#"
                  className="p-3 bg-[#3B0764] rounded-lg text-white hover:bg-[#3B0764]/80"
                >
                  <Twitter className="w-6 h-6" />
                </a>
                <a
                  href="#"
                  className="p-3 bg-[#3B0764] rounded-lg text-white hover:bg-[#3B0764]/80"
                >
                  <Linkedin className="w-6 h-6" />
                </a>
                <a
                  href="#"
                  className="p-3 bg-[#3B0764] rounded-lg text-white hover:bg-[#3B0764]/80"
                >
                  <Github className="w-6 h-6" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;
