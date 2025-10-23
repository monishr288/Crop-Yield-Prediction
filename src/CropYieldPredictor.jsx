import React, { useState, useEffect, useRef } from 'react';
import { Chart, registerables } from 'chart.js';
import './CropYieldPredictor.css';

// Register Chart.js components
Chart.register(...registerables);

const CropYieldPredictor = () => {
  const [formData, setFormData] = useState({
    crop: 'maize',
    rainfall: 100,
    soilFertility: 0.7,
    area: 1,
    temperature: 25,
    sowingDate: new Date().toISOString().split('T')[0]
  });

  const [prediction, setPrediction] = useState({
    crop: 'maize',
    yieldPerHa: '0.90',
    totalYield: '0.90'
  });

  const [pastPredictions, setPastPredictions] = useState([
    'maize - 0.90 tons/ha',
    'rice - 1.20 tons/ha',
    'rice - 1.15 tons/ha',
    'rice - 1.25 tons/ha',
    'rice - 1.10 tons/ha'
  ]);

  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  useEffect(() => {
    generateGrassBlades();
    generateFloatingLeaves();
    // Initialize chart after a small delay to ensure DOM is ready
    setTimeout(() => {
      initializeChart();
    }, 100);
    
    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, []);

  const generateGrassBlades = () => {
    const grassBladesContainer = document.getElementById('grassBlades');
    if (grassBladesContainer) {
      grassBladesContainer.innerHTML = '';
      for (let i = 0; i < 100; i++) {
        const blade = document.createElement('div');
        blade.className = 'grass-blade';
        blade.style.left = `${Math.random() * 100}%`;
        blade.style.animationDelay = `${Math.random() * 3}s`;
        blade.style.height = `${70 + Math.random() * 50}px`;
        grassBladesContainer.appendChild(blade);
      }
    }
  };

  const generateFloatingLeaves = () => {
    const leavesContainer = document.getElementById('floatingLeaves');
    if (leavesContainer) {
      leavesContainer.innerHTML = '';
      for (let i = 0; i < 15; i++) {
        const leaf = document.createElement('div');
        leaf.className = 'leaf';
        leaf.style.left = `${Math.random() * 100}%`;
        leaf.style.animationDelay = `${Math.random() * 15}s`;
        leaf.style.width = `${10 + Math.random() * 20}px`;
        leaf.style.height = leaf.style.width;
        leavesContainer.appendChild(leaf);
      }
    }
  };

  const initializeChart = () => {
    if (chartRef.current) {
      // Destroy existing chart if it exists
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }

      const ctx = chartRef.current.getContext('2d');
      
      chartInstance.current = new Chart(ctx, {
        type: 'line',
        data: {
          labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
          datasets: [
            {
              label: 'Predicted Yield (tons/ha)',
              data: [0.8, 0.9, 1.1, 1.3, 1.5, 1.6, 1.7, 1.6, 1.4, 1.2, 1.0, 0.9],
              borderColor: '#4CAF50',
              backgroundColor: 'rgba(76, 175, 80, 0.1)',
              borderWidth: 3,
              fill: true,
              tension: 0.4,
              
            },
            {
              label: 'Historical Average (tons/ha)',
              data: [0.7, 0.8, 1.0, 1.2, 1.4, 1.5, 1.6, 1.5, 1.3, 1.1, 0.9, 0.8],
              borderColor: '#FF9800',
              backgroundColor: 'rgba(255, 152, 0, 0.1)',
              borderWidth: 2,
              borderDash: [5, 5],
              fill: true,
              tension: 0.4,
              
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: 'top',
              labels: {
                color: '#e0e0e0',
                font: {
                  size: 12,
                  weight: 'bold'
                },
                usePointStyle: true,
                padding: 15,
                boxWidth: 12
              }
            },
            tooltip: {
              backgroundColor: 'rgba(0, 0, 0, 0.9)',
              titleColor: '#4CAF50',
              bodyColor: '#e0e0e0',
              borderColor: '#4CAF50',
              borderWidth: 1,
              padding: 12,
              cornerRadius: 6,
              displayColors: true
            }
          },
          scales: {
            x: {
              grid: {
                color: 'rgba(255, 255, 255, 0.1)',
                drawBorder: true,
                borderColor: 'rgba(255, 255, 255, 0.2)'
              },
              ticks: {
                color: '#e0e0e0',
                font: {
                  size: 11,
                  weight: 'bold'
                },
                padding: 5
              },
              title: {
                display: true,
                text: 'Months',
                color: '#e0e0e0',
                font: {
                  size: 12,
                  weight: 'bold'
                },
                padding: {
                  top: 10
                }
              }
            },
            y: {
              grid: {
                color: 'rgba(255, 255, 255, 0.1)',
                drawBorder: true,
                borderColor: 'rgba(255, 255, 255, 0.2)'
              },
              ticks: {
                color: '#e0e0e0',
                font: {
                  size: 11
                },
                callback: function(value) {
                  return value + ' tons';
                },
                stepSize: 0.5,
                padding: 8
              },
              beginAtZero: true,
              max: 2,
              title: {
                display: true,
                text: 'Yield (tons/ha)',
                color: '#e0e0e0',
                font: {
                  size: 12,
                  weight: 'bold'
                },
                padding: {
                  bottom: 10
                }
              }
            }
          },
          elements: {
            point: {
              radius: 5,
              hoverRadius: 8,
              backgroundColor: '#ffffff',
              borderWidth: 2
            },
            line: {
              tension: 0.4
            }
          },
          layout: {
            padding: {
              left: 5,
              right: 5,
              top: 5,
              bottom: 5
            }
          }
        }
      });
    }
  };

  const updateChart = (crop, yieldPerHa) => {
    if (chartInstance.current) {
      // Update chart data based on prediction with crop-specific patterns
      const basePatterns = {
        maize: [0.6, 0.7, 0.9, 1.2, 1.5, 1.7, 1.8, 1.7, 1.4, 1.1, 0.8, 0.7],
        rice: [0.7, 0.8, 1.0, 1.3, 1.6, 1.8, 2.0, 1.9, 1.6, 1.2, 0.9, 0.8],
        wheat: [0.8, 0.9, 1.1, 1.0, 0.9, 0.8, 0.7, 0.8, 1.0, 1.2, 1.1, 0.9],
        soybean: [0.5, 0.6, 0.8, 1.0, 1.3, 1.5, 1.6, 1.5, 1.2, 0.9, 0.7, 0.6]
      };

      const basePattern = basePatterns[crop] || basePatterns.maize;
      const targetYield = parseFloat(yieldPerHa);
      const currentPeak = Math.max(...basePattern);
      const scaleFactor = targetYield / currentPeak;
      
      const newData = basePattern.map(value => 
        Math.max(0.1, parseFloat((value * scaleFactor).toFixed(2)))
      );

      chartInstance.current.data.datasets[0].data = newData;
      chartInstance.current.update();
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const calculateYield = () => {
    const { crop, rainfall, soilFertility, area, temperature } = formData;
    
    let baseYield;
    switch(crop) {
      case 'maize': baseYield = 1.2; break;
      case 'rice': baseYield = 1.5; break;
      case 'wheat': baseYield = 1.0; break;
      case 'soybean': baseYield = 0.8; break;
      case 'sugarcane': baseYield = 8.0; break;
      case 'millet': baseYield = 0.9; break;
      case 'barley': baseYield = 1.1; break;
      case 'gram': baseYield = 0.7; break;
      case 'groundnut': baseYield = 1.0; break;
      default: baseYield = 1.0;
    }

    const rainfallFactor = Math.min(rainfall / 150, 1.5);
    const tempFactor = 1 - Math.abs(temperature - 25) / 50;
    const fertilityFactor = parseFloat(soilFertility);
    
    const yieldPerHa = (baseYield * rainfallFactor * tempFactor * fertilityFactor).toFixed(2);
    const totalYield = (yieldPerHa * area).toFixed(2);

    const newPrediction = {
      crop,
      yieldPerHa,
      totalYield
    };

    setPrediction(newPrediction);
    updateChart(crop, yieldPerHa);

    // Add to past predictions
    const newPastPrediction = `${crop} - ${yieldPerHa} tons/ha`;
    setPastPredictions(prev => [newPastPrediction, ...prev.slice(0, 4)]);
  };

  return (
    <div className="crop-yield-predictor">
      {/* Advanced Grass Background */}
      <div className="grass-background">
        <div className="grass-layer-1"></div>
        <div className="grass-layer-2"></div>
        <div className="grass-layer-3"></div>
        <div className="grass-blades" id="grassBlades"></div>
      </div>
      
      
      {/* Floating leaves for additional atmosphere */}
      <div className="floating-leaves" id="floatingLeaves"></div>
      <title>🌾Crop Yield Predictor</title>

      {/* Main Content Container */}
      <div className="container">
        <h1>🌾Crop Yield Predictor</h1>
        
        <div className="app-layout-full">
          <div className="input-results-panel">
            <div className="form-section">
              <h2>Input Parameters</h2>
              <div className="input-group">
                <label htmlFor="crop">Crop Type:</label>
                <select 
                  id="crop" 
                  name="crop" 
                  value={formData.crop} 
                  onChange={handleInputChange}
                >
                  <option value="maize">Maize</option>
                  <option value="rice">Rice</option>
                  <option value="wheat">Wheat</option>
                  <option value="soybean">Soybean</option>
                  <option value="sugarcane">Sugarcane</option>
                  <option value="millet">Millet</option>
                  <option value="barley">Barley</option>
                  <option value="gram">Gram</option>
                  <option value="groundnut">Groundnut</option>
                </select>
              </div>
              
              <div className="input-group">
                <label htmlFor="rainfall">Rainfall (mm): {formData.rainfall}mm</label>
                <input 
                  type="range" 
                  id="rainfall" 
                  name="rainfall" 
                  min="50" 
                  max="500" 
                  value={formData.rainfall} 
                  onChange={handleInputChange}
                />
              </div>
              
              <div className="input-group">
                <label htmlFor="soil-fertility">Soil Fertility (0-1): {formData.soilFertility}</label>
                <input 
                  type="range" 
                  id="soil-fertility" 
                  name="soilFertility" 
                  min="0.1" 
                  max="1" 
                  step="0.05" 
                  value={formData.soilFertility} 
                  onChange={handleInputChange}
                />
              </div>
              
              <div className="input-group">
                <label htmlFor="area">Area (hectares):</label>
                <input 
                  type="number" 
                  id="area" 
                  name="area" 
                  min="0.1" 
                  step="0.1" 
                  value={formData.area} 
                  onChange={handleInputChange}
                />
              </div>
              
              <div className="input-group">
                <label htmlFor="temperature">Temperature (°C): {formData.temperature}°C</label>
                <input 
                  type="range" 
                  id="temperature" 
                  name="temperature" 
                  min="10" 
                  max="40" 
                  value={formData.temperature} 
                  onChange={handleInputChange}
                />
              </div>
              
              <div className="input-group">
                <label htmlFor="sowing-date">Sowing Date:</label>
                <input 
                  type="date" 
                  id="sowing-date" 
                  name="sowingDate" 
                  value={formData.sowingDate} 
                  onChange={handleInputChange}
                />
              </div>
              
              <button className="predict-btn" onClick={calculateYield}>
                Predict Yield
              </button>
            </div>
            
            <div className="results-sidebar">
              <div className="result-section">
                <div className="result">
                  <h2>Prediction Result</h2>
                  <div className="result-grid">
                    <div className="result-item">
                      <span className="result-label">Crop:</span>
                      <span className="result-value">{prediction.crop}</span>
                    </div>
                    <div className="result-item">
                      <span className="result-label">Yield per ha:</span>
                      <span className="result-value">{prediction.yieldPerHa} tons/ha</span>
                    </div>
                    <div className="result-item">
                      <span className="result-label">Total Yield:</span>
                      <span className="result-value">{prediction.totalYield} tons</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="past-predictions-section">
                <h2>Past Predictions</h2>
                <ul className="past-predictions">
                  {pastPredictions.map((pred, index) => (
                    <li key={index}>{pred}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Full Width Graph Section */}
          <div className="chart-section-fullwidth">
            <h2>Yield Analysis</h2>
            <div className="chart-container-fullwidth">
              <canvas ref={chartRef}></canvas>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CropYieldPredictor;