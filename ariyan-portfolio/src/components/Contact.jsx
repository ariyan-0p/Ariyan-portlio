import { motion } from 'framer-motion';
import { Mail, Linkedin, MessageCircle, Eye, Phone } from 'lucide-react';

export default function Contact() {
  return (
    <section className="w-full min-h-screen flex flex-col justify-between py-24 md:py-32 bg-black relative overflow-hidden">
      
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-purple-900/20 blur-[150px] rounded-full pointer-events-none"></div>

      <div className="max-w-[1200px] mx-auto px-6 md:px-12 w-full flex-grow flex flex-col justify-center relative z-10">
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-24 items-start">
          
          {/* LEFT COLUMN: Call to Action */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            <h2 className="text-5xl md:text-8xl font-bold text-white leading-tight">
              Let's have <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-500">a Chat.</span>
            </h2>
            
            <p className="text-slate-400 text-lg md:text-xl max-w-md leading-relaxed">
              Want to discuss a project, architect a scalable system, or just talk tech? Hit me up!
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              {/* WhatsApp Primary Chat (Works on Laptop & Phone) */}
              <a 
                href="https://wa.me/919937643350?text=Hi%20Ariyan,%20I%20saw%20your%20portfolio%20and%20wanted%20to%20connect!"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-3 px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-bold rounded-full text-lg hover:shadow-[0_0_30px_rgba(147,51,234,0.5)] transition-all transform hover:-translate-y-1"
              >
                Let's Chat <MessageCircle size={20} />
              </a>

              {/* View Resume Button (Matching Home Section) */}
              <a 
                href="https://drive.google.com/file/d/1HCPv5xKLeqKqKzcVYqbPBHbWMpvQD321/view?usp=sharing" 
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-3 px-8 py-4 bg-white/5 border border-white/10 text-white font-bold rounded-full text-lg hover:bg-white/10 transition-all transform hover:-translate-y-1"
              >
                View Resume <Eye size={20} />
              </a>
            </div>
          </motion.div>


          {/* RIGHT COLUMN: Contact Details */}
          <motion.div
             initial={{ opacity: 0, y: 20 }}
             whileInView={{ opacity: 1, y: 0 }}
             viewport={{ once: true }}
             transition={{ delay: 0.2 }}
             className="space-y-12 md:pt-4"
          >
             
             {/* Contact Info Block */}
             <div className="space-y-6">
                <div className="space-y-2">
                    <h3 className="text-slate-500 text-sm font-mono tracking-widest uppercase mb-1">Email</h3>
                    <a href="mailto:ariyansamal1201@gmail.com" className="block text-2xl md:text-3xl font-bold text-white hover:text-purple-400 transition-colors break-words">
                      ariyansamal1201@gmail.com
                    </a>
                </div>
                
                <div className="space-y-2">
                    <h3 className="text-slate-500 text-sm font-mono tracking-widest uppercase mb-1">Phone</h3>
                    <a href="tel:+919937643350" className="block text-2xl md:text-3xl font-bold text-white hover:text-purple-400 transition-colors">
                      +91 99376 43350
                    </a>
                </div>
             </div>

             {/* Socials Block - Now includes WhatsApp */}
             <div className="space-y-4">
                <h3 className="text-slate-500 text-sm font-mono tracking-widest uppercase">Follow Me</h3>
                <div className="flex gap-4">
                   {/* LinkedIn */}
                   <SocialLink 
                      icon={<Linkedin size={20} />} 
                      href="https://www.linkedin.com/in/ariyan-samal-767614281/" 
                   />
                   
                   {/* WhatsApp Redirect */}
                   <SocialLink 
                      icon={<MessageCircle size={20} />} 
                      href="https://wa.me/919937643350" 
                   />

                   {/* Email Button */}
                   <SocialLink 
                      icon={<Mail size={20} />} 
                      href="mailto:ariyansamal1201@gmail.com" 
                   />
                </div>
             </div>

          </motion.div>

        </div>
      </div>

      {/* FOOTER */}
      <div className="w-full text-center py-8 border-t border-white/5 relative z-10">
         <p className="text-slate-600 text-sm">
            Made with passion by <span className="text-purple-400">Ariyan Samal</span>. © 2026
         </p>
      </div>

    </section>
  );
}

// Simple Social Link Component
function SocialLink({ icon, href }) {
  return (
    <a 
      href={href} 
      target="_blank" 
      rel="noopener noreferrer"
      className="w-12 h-12 flex items-center justify-center rounded-xl border border-white/10 text-slate-400 hover:text-white hover:bg-white/5 hover:border-purple-500/50 transition-all duration-300"
    >
      {icon}
    </a>
  );
}