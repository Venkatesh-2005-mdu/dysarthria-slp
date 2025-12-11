import React, { useState, useEffect, useRef } from 'react';
import "./InteractiveMouth.css";
import mouthImageSrc from "../../images/mouth-anatomy.jpg";

// Define the mouth parts data with PIXEL COORDINATES
// These work with the actual image dimensions
const mouthParts = [
    { 
        name: 'Uvula', 
        coords: '507,350,501,323,525,316,552,320,546,351,540,371,515,371', 
        shape: 'poly' 
    },
    { 
        name: 'Soft Palate', 
        coords: '463,276,439,298,471,303,503,299,528,306,550,299,589,305,615,293,580,272,526,249', 
        shape: 'poly' 
    },
    { 
        name: 'Hard Palate', 
        coords: '455,202,464,218,477,237,521,225,571,238,585,218,589,197,562,176,521,175,477,177,464,186', 
        shape: 'poly' 
    },
    { 
        name: 'Upper Teeth', 
        coords: '317,303,327,259,350,209,373,169,408,137,449,110,500,91,553,90,598,111,631,127,667,155,691,189,708,221,724,252,732,287,726,309,700,319,674,309,662,278,650,244,632,211,620,185,612,165,580,151,530,149,474,150,442,165,428,185,420,208,404,234,394,266,384,293,368,318,339,315', 
        shape: 'poly' 
    },
    { 
        name: 'Lower Teeth', 
        coords: '315,479,317,440,367,439,382,468,405,549,432,578,460,598,495,602,527,603,558,602,592,594,623,580,638,565,650,549,663,509,673,470,687,435,743,444,736,484,724,527,699,576,673,601,638,626,598,638,561,643,526,646,493,641,456,636,418,625,382,602,353,576,334,528,322,503', 
        shape: 'poly' 
    },
    { 
        name: 'Tongue', 
        coords: '388,445,413,400,490,388,521,395,559,389,627,395,673,448,650,509,604,550,529,572,433,547,399,492', 
        shape: 'poly' 
    },
    { 
        name: 'Upper Lips', 
        coords: '297,347,315,208,333,155,360,107,398,64,442,35,491,26,521,32,553,24,593,32,642,50,683,93,713,138,730,195,751,275,754,339,728,247,709,185,685,143,651,101,605,74,568,63,526,58,473,69,436,81,395,118,354,173,328,237', 
        shape: 'poly' 
    },
    { 
        name: 'Lower Lips', 
        coords: '297,430,296,470,300,508,309,562,323,609,346,651,391,699,453,728,519,738,551,739,617,722,663,699,697,671,728,622,744,575,757,521,761,468,761,443,759,426,751,435,744,476,736,509,727,547,720,580,692,611,656,642,636,660,599,679,567,687,522,692,488,686,449,677,414,660,389,648,362,619,344,593,332,559,322,516,312,478', 
        shape: 'poly' 
    },
];

const InteractiveMouth = ({ onDataChange }) => {
    const [selectedPart, setSelectedPart] = useState(null);
    const [structuralInput, setStructuralInput] = useState('');
    const [functionalInput, setFunctionalInput] = useState('');
    const [impressionInput, setImpressionInput] = useState(
        localStorage.getItem('oralCavityImpression') || ''
    );
    const [savedData, setSavedData] = useState(null);
    const [allFindings, setAllFindings] = useState({});
    const [imageDims, setImageDims] = useState({ width: 1041, height: 800 }); // Default dims
    const imageRef = useRef(null);

    // Effect to load saved data when a part is selected
    useEffect(() => {
        if (selectedPart) {
            loadSavedData(selectedPart.name);
        }
    }, [selectedPart]);
    
    // Save impression to localStorage
    useEffect(() => {
        localStorage.setItem('oralCavityImpression', impressionInput);
    }, [impressionInput]);

    // Load all findings from localStorage on mount
    useEffect(() => {
        const saved = {};
        mouthParts.forEach((part) => {
            const data = localStorage.getItem(`oralCavity_${part.name}`);
            if (data) {
                saved[part.name] = JSON.parse(data);
            }
        });
        setAllFindings(saved);
    }, []);

    // Get actual image dimensions when image loads
    useEffect(() => {
        const img = imageRef.current;
        if (img) {
            const updateDims = () => {
                setImageDims({
                    width: img.naturalWidth,
                    height: img.naturalHeight,
                    displayWidth: img.offsetWidth,
                    displayHeight: img.offsetHeight,
                });
            };
            if (img.complete) {
                updateDims(); // Image already loaded
            }
            img.addEventListener('load', updateDims);
            return () => img.removeEventListener('load', updateDims);
        }
    }, []);

    const loadSavedData = (partName) => {
        const data = localStorage.getItem(`oralCavity_${partName}`);
        if (data) {
            const parsedData = JSON.parse(data);
            setSavedData(parsedData);
            setStructuralInput(parsedData.structural || '');
            setFunctionalInput(parsedData.functional || '');
        } else {
            setSavedData(null);
            setStructuralInput('');
            setFunctionalInput('');
        }
    };

    const handleAreaClick = (part) => {
        setSelectedPart(part);
    };

    // Click handler for image - detects which area was clicked
    const handleImageClick = (e) => {
        const img = imageRef.current;
        if (!img) return;

        const rect = img.getBoundingClientRect();
        const clickX = e.clientX - rect.left;
        const clickY = e.clientY - rect.top;

        // Scale to original image dimensions
        const scaleX = imageDims.width / rect.width;
        const scaleY = imageDims.height / rect.height;
        
        const origX = clickX * scaleX;
        const origY = clickY * scaleY;

        console.log(`Clicked at: (${origX.toFixed(0)}, ${origY.toFixed(0)})`);

        // Check which part was clicked based on coordinates
        for (const part of mouthParts) {
            if (isPointInPolygon([origX, origY], part.coords)) {
                setSelectedPart(part);
                return;
            }
        }
    };

    // Helper function to check if point is in polygon
    const isPointInPolygon = (point, coordString) => {
        const coords = coordString.split(',').map(Number);
        const polygon = [];
        for (let i = 0; i < coords.length; i += 2) {
            polygon.push([coords[i], coords[i + 1]]);
        }

        const [x, y] = point;
        let isInside = false;
        for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
            const [xi, yi] = polygon[i];
            const [xj, yj] = polygon[j];
            
            const intersect =
                yi > y !== yj > y &&
                x < ((xj - xi) * (y - yi)) / (yj - yi) + xi;
            if (intersect) isInside = !isInside;
        }
        return isInside;
    };

    const handleCloseModal = () => {
        setSelectedPart(null);
        setStructuralInput('');
        setFunctionalInput('');
        setSavedData(null);
    };

    const handleSubmit = (event) => {
        event.preventDefault();

        if (!structuralInput.trim() || !functionalInput.trim()) {
            alert('Please fill out both Structural and Functional inputs.');
            return;
        }

        const data = { structural: structuralInput.trim(), functional: functionalInput.trim() };

        // Save to localStorage
        localStorage.setItem(`oralCavity_${selectedPart.name}`, JSON.stringify(data));

        // Update state
        setSavedData(data);
        const updated = { ...allFindings, [selectedPart.name]: data };
        setAllFindings(updated);

        if (onDataChange) {
            onDataChange({
                findings: updated,
                impression: impressionInput,
            });
        }

        alert(`Data for ${selectedPart.name} saved successfully!`);
    };

    return (
        <div className="interactive-mouth-app">
            <h1 className="main-title">👄 Oral Cavity Examination</h1>
            <p className="main-subtitle">
                Click on different parts of the mouth to enter structural and functional details
            </p>

            {/* Content wrapper with image and impression side-by-side */}
            <div className="content-wrapper">
                {/* Image Container */}
                <div className="image-container">
                    <img 
                        ref={imageRef}
                        id="mouthImage" 
                        src={mouthImageSrc} 
                        alt="Anatomical Mouth Diagram" 
                        useMap="#mouthMap"
                        onClick={handleImageClick}
                        style={{ cursor: 'pointer', display: 'block' }}
                    />

                    <map name="mouthMap">
                        {mouthParts.map((part, index) => (
                            <area 
                                key={`${part.name}-${index}`}
                                shape={part.shape}
                                coords={part.coords}
                                href="#"
                                alt={part.name}
                                onClick={(e) => {
                                    e.preventDefault();
                                    handleAreaClick(part);
                                }}
                                title={`Click to examine ${part.name}`}
                            />
                        ))}
                    </map>
                </div>

                {/* Impression Section */}
                <div className="impression-section glass-card">
                    <h3 className="impression-title">📝 Clinical Impression</h3>
                    <label htmlFor="impressionInput">Summary & Recommendations:</label>
                    <textarea
                        id="impressionInput"
                        rows="8"
                        value={impressionInput}
                        onChange={(e) => setImpressionInput(e.target.value)}
                        placeholder="Enter your summary or final clinical impression here (e.g., structure, function, and recommended steps)."
                        className="impression-textarea"
                    />
                </div>
            </div>

            {/* Findings Summary Grid */}
            <div className="findings-summary glass-card">
                <h3 className="summary-title">📋 Examination Findings Summary</h3>
                <div className="findings-grid">
                    {mouthParts.map((part) => (
                        <div
                            key={part.name}
                            className={`finding-card ${allFindings[part.name] ? 'completed' : ''}`}
                            onClick={() => {
                                handleAreaClick(part);
                            }}
                        >
                            <div className="finding-label">{part.name}</div>
                            <div className="finding-status">
                                {allFindings[part.name] ? (
                                    <span className="status-completed">✓ Completed</span>
                                ) : (
                                    <span className="status-pending">○ Pending</span>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Modal */}
            {selectedPart && (
                <div className="modal-overlay" onClick={handleCloseModal}>
                    <div className="modal-content glass-card" onClick={(e) => e.stopPropagation()}>
                        <button className="modal-close" onClick={handleCloseModal}>
                            ✕
                        </button>

                        <h2 className="modal-title">{selectedPart.name}</h2>

                        <form onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label htmlFor="structuralInput">Structural Details:</label>
                                <textarea
                                    id="structuralInput"
                                    rows="4"
                                    value={structuralInput}
                                    onChange={(e) => setStructuralInput(e.target.value)}
                                    placeholder="Enter structural observations (e.g., size, shape, symmetry, position, color)"
                                    required
                                    className="modal-textarea"
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="functionalInput">Functional Details:</label>
                                <textarea
                                    id="functionalInput"
                                    rows="4"
                                    value={functionalInput}
                                    onChange={(e) => setFunctionalInput(e.target.value)}
                                    placeholder="Enter functional observations (e.g., movement, strength, tone, coordination)"
                                    required
                                    className="modal-textarea"
                                />
                            </div>

                            <button type="submit" className="btn btn-primary">
                                Save Data
                            </button>
                        </form>

                        {/* Saved Data Display */}
                        {savedData && (
                            <div className="saved-data-display">
                                <h3>Last Saved Data:</h3>
                                <p>
                                    <strong>Structural:</strong> {savedData.structural}
                                </p>
                                <p>
                                    <strong>Functional:</strong> {savedData.functional}
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default InteractiveMouth;
