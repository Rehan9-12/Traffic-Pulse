import React from "react";
import Head from "next/head";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import Link from "next/link";

export default function Home() {
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.6 }
    }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  return (
    <>
      <Head>
        <title>TrafficPulse - Real-time Traffic Monitoring</title>
        <meta name="description" content="Real-time traffic monitoring system with live map visualization" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="bg-gradient-to-b from-slate-900 to-slate-800 min-h-screen flex flex-col text-white">
        <Header />
        
        <main className="flex-1 flex flex-col">
          {/* Hero Section */}
          <section className="relative h-[70vh] flex items-center justify-center overflow-hidden">
            <div className="absolute inset-0 z-0">
              <img 
                src="https://images.unsplash.com/photo-1596005554384-d293674c91d7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2071&q=80" 
                alt="Indian traffic aerial view" 
                className="w-full h-full object-cover opacity-30"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900 to-transparent"></div>
            </div>
            
            <motion.div 
              className="container mx-auto px-4 z-10 text-center"
              initial="hidden"
              animate="visible"
              variants={staggerContainer}
            >
              <motion.h1 
                className="text-5xl md:text-7xl font-bold mb-6"
                variants={fadeIn}
              >
                TrafficPulse
              </motion.h1>
              <motion.p 
                className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto text-slate-200"
                variants={fadeIn}
              >
                Real-time traffic monitoring with advanced visualization and analytics
              </motion.p>
              <motion.div variants={fadeIn}>
                <Link href="/dashboard">
                  <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white mr-4">
                    Launch Dashboard
                  </Button>
                </Link>
                <Link href="/signup">
                  <Button size="lg" className="bg-green-600 hover:bg-green-700 text-white">
                    Sign Up
                  </Button>
                </Link>
              </motion.div>
            </motion.div>
          </section>

          {/* Features Section */}
          <section className="py-20 bg-slate-800">
            <div className="container mx-auto px-4">
              <motion.h2 
                className="text-3xl md:text-4xl font-bold mb-12 text-center"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
              >
                Key Features
              </motion.h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <motion.div 
                  className="bg-slate-700 p-8 rounded-lg"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                  viewport={{ once: true }}
                >
                  <h3 className="text-xl font-bold mb-4">Real-time Monitoring</h3>
                  <p className="text-slate-300">
                    Get live updates on traffic conditions with data refreshed every 30-60 seconds from trusted sources.
                  </p>
                </motion.div>
                
                <motion.div 
                  className="bg-slate-700 p-8 rounded-lg"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  viewport={{ once: true }}
                >
                  <h3 className="text-xl font-bold mb-4">Interactive Maps</h3>
                  <p className="text-slate-300">
                    Visualize traffic flow, incidents, and congestion with intuitive map overlays and interactive elements.
                  </p>
                </motion.div>
                
                <motion.div 
                  className="bg-slate-700 p-8 rounded-lg"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                  viewport={{ once: true }}
                >
                  <h3 className="text-xl font-bold mb-4">Customizable Filters</h3>
                  <p className="text-slate-300">
                    Focus on what matters with filters for incidents, congestion levels, and construction zones.
                  </p>
                </motion.div>
              </div>
            </div>
          </section>

          {/* Call to Action */}
          <section className="py-20 bg-slate-900">
            <div className="container mx-auto px-4 text-center">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
              >
                <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to optimize your routes?</h2>
                <p className="text-xl text-slate-300 mb-8 max-w-2xl mx-auto">
                  Join thousands of users who rely on TrafficPulse for their daily commute and logistics planning.
                </p>
                <Link href="/dashboard">
                  <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white">
                    Get Started Now
                  </Button>
                </Link>
              </motion.div>
            </div>
          </section>
        </main>
        
        <footer className="bg-slate-900 py-8 border-t border-slate-800">
          <div className="container mx-auto px-4 text-center text-slate-400">
            <p>© 2025 TrafficPulse. All rights reserved.</p>
          </div>
        </footer>
      </div>
    </>
  );
}