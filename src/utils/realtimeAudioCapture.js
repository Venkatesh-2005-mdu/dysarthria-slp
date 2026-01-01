/**
 * Real-time Audio Capture Utility
 * Captures actual time-domain audio data during recording for live waveform display
 */

export class RealtimeAudioCapture {
  constructor(onAudioData, samplingRate = 16000) {
    this.audioContext = null;
    this.analyser = null;
    this.dataArray = null;
    this.onAudioData = onAudioData;
    this.samplingRate = samplingRate;
    this.animationFrameId = null;
    this.isCapturing = false;
  }

  /**
   * Start capturing real-time audio data
   * @param {MediaStream} stream - Audio stream from getUserMedia
   */
  async start(stream) {
    try {
      if (!this.audioContext) {
        this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
      }

      const source = this.audioContext.createMediaStreamSource(stream);
      
      // Create analyser for time-domain data
      if (!this.analyser) {
        this.analyser = this.audioContext.createAnalyser();
        this.analyser.fftSize = 2048;  // 2048 samples per frame
      }

      source.connect(this.analyser);
      // Use 8-bit data for time-domain (getByteTimeDomainData)
      this.dataArray = new Uint8Array(this.analyser.frequencyBinCount);
      
      this.isCapturing = true;
      this.captureAudioFrame();
    } catch (err) {
      console.error("Error starting real-time audio capture:", err);
    }
  }

  /**
   * Capture audio data frame by frame
   */
  captureAudioFrame = () => {
    if (!this.isCapturing) return;

    // Get time-domain waveform data (actual audio samples)
    this.analyser.getByteTimeDomainData(this.dataArray);
    
    // Convert byte data to normalized float samples (-1 to 1)
    const audioSamples = Array.from(this.dataArray).map(byte => {
      return (byte / 128.0) - 1.0;  // Convert from [0-255] to [-1, 1]
    });

    // Send to callback (for waveform display)
    if (this.onAudioData && audioSamples.length > 0) {
      this.onAudioData(audioSamples);
    }

    // Continue capturing at ~60fps for smooth display
    this.animationFrameId = requestAnimationFrame(this.captureAudioFrame);
  };

  /**
   * Stop capturing audio data
   */
  stop() {
    this.isCapturing = false;
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
    }
  }

  /**
   * Clean up resources
   */
  cleanup() {
    this.stop();
    if (this.audioContext) {
      try {
        this.audioContext.close();
      } catch (err) {
        console.error("Error closing audio context:", err);
      }
      this.audioContext = null;
    }
  }
}

export default RealtimeAudioCapture;
