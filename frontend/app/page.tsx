'use client';

import { useState } from 'react';


export default function LaptopForm() {
  const [formData, setFormData] = useState({
    company: '',
    typeName: '',
    gpu: '',
    cpu: '',
    ram: '',
    memoryType: '',
    memorySize: '',
    screenResolution: '',
    weight: '',
    gaming: false,
  });


  const [prediction, setPrediction] = useState<number | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, type, value } = e.target as HTMLInputElement | HTMLSelectElement;
    const checked = type === 'checkbox' && (e.target as HTMLInputElement).checked;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const extractFeatures = () => {
    const {
      company, typeName, gpu, cpu, ram, memoryType, memorySize, screenResolution, weight, gaming,
    } = formData;

    const [screenWidth, screenHeight] = screenResolution.toLowerCase().split('x').map(Number);
    const cpuFreqRegex = /(\d+(\.\d+)?)\s*GHz/i;
    const cpuFreqMatch = cpuFreqRegex.exec(cpu);
    const cpuFreq = cpuFreqMatch ? parseFloat(cpuFreqMatch[1]) : 0;

    return {
      Acer: company === 'Acer' ? 1 : 0,
      Razer: company === 'Razer' ? 1 : 0,
      Notebook: typeName === 'Notebook' ? 1 : 0,
      Ultrabook: typeName === 'Ultrabook' ? 1 : 0,
      Workstation: typeName === 'Workstation' ? 1 : 0,
      Nvidia_GPU: gpu.toLowerCase().includes('nvidia') ? 1 : 0,
      Gaming: gaming ? 1 : 0,
      Ram: parseInt(ram),
      Weight: parseFloat(weight),
      FlashStorage: memoryType === 'FlashStorage' ? parseInt(memorySize) : 0,
      HDD: memoryType === 'HDD' ? parseInt(memorySize) : 0,
      SSD: memoryType === 'SSD' ? parseInt(memorySize) : 0,
      CPU_Frequency: cpuFreq,
      Screen_Height: screenHeight || 0,
      Screen_Width: screenWidth || 0,
    };
  };

  interface Features {
    Acer: number;
    Razer: number;
    Notebook: number;
    Ultrabook: number;
    Workstation: number;
    Nvidia_GPU: number;
    Gaming: number;
    Ram: number;
    Weight: number;
    FlashStorage: number;
    HDD: number;
    SSD: number;
    CPU_Frequency: number;
    Screen_Height: number;
    Screen_Width: number;
  }

  interface PredictionResponse {
    prediction: number;
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const features: Features = extractFeatures();
  
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
    // Use environment variable for the backend URL
    
    const res = await fetch(`${backendUrl}/predict`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(features),
    });
  
    const data: PredictionResponse = await res.json();
    setPrediction(data.prediction);
  };

  return (
    <div className="relative flex flex-col items-center justify-center w-full min-h-screen overflow-hidden antialiased bg-gradient-to-br from-slate-900 via-slate-800 to-slate-950">
         {/* Radial Background */}
    <div className="absolute inset-0 z-0 pointer-events-none">
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-950" />

      {/* Left glowing circle */}
      <div className="absolute top-1/3 -left-40 w-[600px] h-[600px] bg-[radial-gradient(circle,_rgba(56,189,248,0.25)_0%,_transparent_70%)] rounded-full" />

      {/* Right glowing circle */}
      <div className="absolute top-2/3 -right-40 w-[700px] h-[700px] bg-[radial-gradient(circle,_rgba(139,92,246,0.2)_0%,_transparent_70%)] rounded-full" />
    </div>
      {/* Form Container */}
      <div className="relative z-10 w-full max-w-2xl p-6 mx-auto">
        <h1 className="mb-8 text-3xl font-bold text-center md:text-4xl text-slate-100">
          Laptop Price Prediction
        </h1>
  
        <form onSubmit={handleSubmit} className="grid max-w-3xl grid-cols-2 gap-4 p-8 mx-auto border shadow-2xl bg-slate-900/80 backdrop-blur-md rounded-2xl border-slate-700/50">
          {/* Form Elements */}
          <label htmlFor="company" className="sr-only">Select Company</label>
          <select 
            id="company"
            name="company" 
            onChange={handleChange}
            className="p-3 transition-all border rounded-xl bg-slate-900/70 border-slate-700 text-slate-200 focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
          >
            <option value="" className="bg-slate-800">Select Company</option>
            <option value="Acer" className="bg-slate-800">Acer</option>
            <option value="Razer" className="bg-slate-800">Razer</option>
            <option value="Dell" className="bg-slate-800">Dell</option>
          </select>
  
          <select 
            name="typeName" 
            onChange={handleChange}
            aria-label="Select Type"
            className="p-3 transition-all border rounded-xl bg-slate-900/70 border-slate-700 text-slate-200 focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
          >
            <option value="" className="bg-slate-800">Select Type</option>
            <option value="Notebook" className="bg-slate-800">Notebook</option>
            <option value="Ultrabook" className="bg-slate-800">Ultrabook</option>
            <option value="Workstation" className="bg-slate-800">Workstation</option>
          </select>
  
          {[
            { name: 'gpu', placeholder: 'GPU Brand (e.g. Nvidia)' },
            { name: 'cpu', placeholder: 'CPU (e.g. i7 2.8GHz)' },
            { name: 'ram', placeholder: 'RAM (GB)', type: 'number' },
            { name: 'memorySize', placeholder: 'Storage Size (GB)', type: 'number' },
            { name: 'screenResolution', placeholder: 'Resolution (1920x1080)' },
            { name: 'weight', placeholder: 'Weight (kg)', type: 'number' },
          ].map((field) => (
            <input
              key={field.name}
              name={field.name}
              type={field.type ?? 'text'}
              placeholder={field.placeholder}
              onChange={handleChange}
              className="p-3 transition-all border rounded-xl bg-slate-900/70 border-slate-700 text-slate-200 placeholder-slate-400 focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
            />
          ))}
  
          <label htmlFor="memoryType" className="sr-only">Select Storage Type</label>
          <select 
            id="memoryType"
            name="memoryType" 
            onChange={handleChange}
            className="p-3 transition-all border rounded-xl bg-slate-900/70 border-slate-700 text-slate-200 focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
          >
            <option value="" className="bg-slate-800">Storage Type</option>
            <option value="SSD" className="bg-slate-800">SSD</option>
            <option value="HDD" className="bg-slate-800">HDD</option>
            <option value="Flash" className="bg-slate-800">Flash</option>
          </select>
  
          <label className="flex items-center gap-3 p-3 rounded-xl0">
            <input 
              type="checkbox" 
              name="gaming" 
              onChange={handleChange}
              className="w-5 h-5 rounded-md text-sky-500 border-slate-600 focus:ring-sky-500"
            />
            <span className="text-slate-300">Gaming Laptop</span>
          </label>
  
          <button 
          type="submit" 
          className="col-span-2 p-3 text-lg font-semibold transition-all text-slate-100 bg-sky-500 rounded-xl hover:bg-sky-600 focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 focus:ring-offset-slate-900"
        >
          Predict Price
        </button>
        {prediction && (
          <div className="col-span-2 p-4 text-center border rounded-lg bg-emerald-500/10 border-emerald-500/30">
            <p className="text-xl font-semibold text-emerald-400">
              Predicted Price: <span className="text-emerald-300">€{Number(prediction).toFixed(2)}</span>
            </p>
          </div>
        )}

        </form>
      </div>
    </div>
  );
  
  
  
  
  
}
