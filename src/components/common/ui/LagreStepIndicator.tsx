import React from 'react';
import CheckIcon from '@mui/icons-material/Check';

interface StepIndicatorProps {
  currentStep: number;
  steps: Array<{
    title: string;
  }>;
}

export default function StepIndicator({ currentStep, steps }: StepIndicatorProps) {
  return (
    <div className="w-full py-8">
      <div className="relative flex items-center justify-center max-w-full mx-auto">
        {steps.map((step, index) => (
          <React.Fragment key={index}>
            {/* 스텝 원 */}
            <div className="relative flex flex-col items-center">
              <div className={`
                w-8 h-8 rounded-full flex items-center justify-center border-2
                ${index <= currentStep - 1 
                  ? 'border-bold bg-bold'
                  : index === currentStep 
                    ? 'border-bold bg-white'
                    : 'border-sub bg-white'
                }
              `}>
                {index <= currentStep - 1 ? (
                  <CheckIcon className="text-white w-5 h-5" />
                ) : index === currentStep ? (
                  <div className="w-2.5 h-2.5 rounded-full bg-bold" />
                ) : null}
              </div>
              
              {/* 단계별 제목 */}
              <span className={`
                absolute top-12 text-sm whitespace-nowrap
                ${index <= currentStep - 1 
                  ? 'text-bold' 
                  : index === currentStep 
                    ? 'text-bold'
                    : 'text-sub'
                }
              `}>
                {step.title}
              </span>
            </div>

            {/* 연결 선 */}
            {index < steps.length - 1 && (
              <div className="w-1/3 h-0.5 mx-2">
                <div className={`
                  h-full
                  ${index <= currentStep - 1 
                    ? 'bg-bold'
                    : 'bg-sub'
                  }
                `} />
              </div>
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}