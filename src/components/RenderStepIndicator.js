import { CONSTANTS } from '../constants/bookingIndex.js';

export const RenderStepIndicator = ({step}) => (
  <div className="booking-content">
    <div className="booking-date">
      {Array.from({ length: CONSTANTS.STEPS }, (_, i) => i + 1).map((stepNum) => (
        <div
          key={stepNum}
          className={`w-8 h-8 rounded-full flex items-center justify-center ${
            step >= stepNum ? 'bg-blue-500 text-white' : 'bg-gray-200'
          }`}
        >
          {stepNum}
        </div>
      ))}
    </div>
    <div className="booking-date-box">
      <div
        className="booking-date-round"
        style={{ width: `${(step / CONSTANTS.STEPS) * 100}%` }}
      />
    </div>
  </div>
);
