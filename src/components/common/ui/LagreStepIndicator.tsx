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
    <div role="navigation" aria-label="progress" className="w-full py-8" data-testid="step-indicator">
      <div className="relative flex items-center justify-center max-w-full mx-auto">
        {steps.map((step, index) => (
          <React.Fragment key={index}>
            {/* 스텝 원 */}
            <div
              data-testid={`step-item-${index}`}
              role="progressbar"
              aria-valuenow={index + 1}
              aria-valuemin={1}
              aria-valuemax={steps.length}
              aria-label={`Step ${index + 1}: ${step.title}`}
              className="relative flex flex-col items-center"
            >
              <div
                data-testid={`step-circle-${index}`}
                className={`
                w-8 h-8 rounded-full flex items-center justify-center border-2
                ${index <= currentStep - 1
                    ? 'border-bold bg-bold'
                    : index === currentStep
                      ? 'border-bold bg-white'
                      : 'border-sub bg-white'
                  }
              `}>
                {index <= currentStep - 1 ? (
                  <CheckIcon
                    data-testid={`step-check-${index}`}
                    aria-label="completed"
                    className="text-white w-5 h-5"
                  />
                ) : index === currentStep ? (
                  <div
                    data-testid={`step-dot-${index}`}
                    role="presentation"
                    className="w-2.5 h-2.5 rounded-full bg-bold"
                  />
                ) : null}
              </div>

              <span
                data-testid={`step-title-${index}`}
                className={`
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
              <div
                data-testid={`step-connector-${index}`}
                role="presentation"
                className="w-1/3 h-0.5 mx-2">
                <div
                  data-testid={`step-connector-line-${index}`}
                  className={`
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