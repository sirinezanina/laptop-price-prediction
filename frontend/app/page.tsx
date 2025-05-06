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
  
    //console.log('Sending features to backend:', features);
    //console.log('Backend URL:', backendUrl);
    const res = await fetch(`${backendUrl}/predict`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(features),
    });
  
    const data: PredictionResponse = await res.json();
    setPrediction(data.prediction);
  };

  return (
    <form onSubmit={handleSubmit} 
    className="grid max-w-3xl grid-cols-2 gap-4 p-4 mx-auto bg-white rounded shadow-md ">  
      <h1 className="col-span-2 text-2xl font-bold text-center">Laptop Price Prediction</h1>
      
      <label htmlFor="company" className="sr-only">Select Company</label>
      <select id="company" name="company" onChange={handleChange} className="p-2 border rounded">
        <option value="">Select Company</option>
        <option value="Acer">Acer</option>
        <option value="Razer">Razer</option>
        <option value="Dell">Dell</option>
        {/* Add more if needed */}
      </select>

      <label htmlFor="typeName" className="sr-only">Select Type</label>
      <select id="typeName" name="typeName" onChange={handleChange} className="p-2 border rounded">
        <option value="">Select Type</option>
        <option value="Notebook">Notebook</option>
        <option value="Ultrabook">Ultrabook</option>
        <option value="Workstation">Workstation</option>
      </select>

      <input name="gpu" placeholder="GPU Brand (e.g. Nvidia)" onChange={handleChange} className="p-2 border rounded" />
      <input name="cpu" placeholder="CPU (e.g. i7 2.8GHz)" onChange={handleChange} className="p-2 border rounded" />
      <input name="ram" type="number" placeholder="RAM (GB)" onChange={handleChange} className="p-2 border rounded" />
      <input name="memorySize" type="number" placeholder="Storage Size (GB)" onChange={handleChange} className="p-2 border rounded" />
      <label htmlFor="memoryType" className="sr-only">Select Storage Type</label>
      <select id="memoryType" name="memoryType" onChange={handleChange} className="p-2 border rounded">
        <option value="">Storage Type</option>
        <option value="SSD">SSD</option>
        <option value="HDD">HDD</option>
        <option value="Flash">Flash</option>
      </select>
      <input name="screenResolution" placeholder="Resolution (e.g. 1920x1080)" onChange={handleChange} className="p-2 border rounded" />
      <input name="weight" type="number" step="any" placeholder="Weight (kg)" onChange={handleChange} className="p-2 border rounded" />

      <label className="flex items-center space-x-2">
        <input type="checkbox" name="gaming" onChange={handleChange} />
        <span>Gaming Laptop</span>
      </label>

      <button type="submit" className="col-span-2 py-2 text-white bg-blue-600 rounded hover:bg-blue-700">
        Predict Price
      </button>

      {prediction && (
        <div className="col-span-2 text-xl font-semibold text-center text-green-700">
          Predicted Price: €{prediction}
        </div>
      )}
    </form>
  );
}
