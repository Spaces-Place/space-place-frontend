// RenderStepIndicator.js
export const RenderStepIndicator = ({ currentStep, totalStep }) => {
  const steps = [
    { number: 1, label: '예약정보' },
    { number: 2, label: '예약자정보' },
    { number: 3, label: '결제정보' },
    { number: 4, label: '예약확인' },
  ];

  return (
    <div className="booking_step-numbers">
      {steps.map(({number, label}) => (
        <div key={number} className="booking_step-item">
          <div 
            className={`booking_step-number ${
              currentStep === number 
                ? 'active'
                : currentStep > number 
                  ? 'completed' 
                  : ''
            }`}
          >
            {number}
          </div>
          <div className="booking_step-label">{label}</div>
        </div>
      ))}
    </div>
  );
};