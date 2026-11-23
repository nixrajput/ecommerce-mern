import { Typography, Stepper, StepLabel, Step } from "@mui/material";

function CheckoutSteps({ activeStep }) {
  const steps = [
    {
      label: <Typography>Shipping Details</Typography>,
    },
    {
      label: <Typography>Order Summary</Typography>,
    },
    {
      label: <Typography>Payment</Typography>,
    },
  ];

  return (
    <div>
      <Stepper alternativeLabel activeStep={activeStep}>
        {steps.map((item, index) => (
          <Step
            key={index}
            active={activeStep === index ? true : false}
            completed={activeStep > index ? true : false}
          >
            <StepLabel
              style={{
                color: activeStep >= index ? "#A239CA" : "rgba(0, 0, 0, 0.6)",
              }}
            >
              {item.label}
            </StepLabel>
          </Step>
        ))}
      </Stepper>
    </div>
  );
}

export default CheckoutSteps;
