import React, { useMemo } from 'react';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Controller } from 'react-hook-form';

export default function AppointmentDatePicker({ 
  control, 
  highlightedDates, 
  doctorSlots, 
  onDateChange,
  watch
}) {
  // Custom CSS for highlighted dates
  const customDatePickerStyles = `
    .react-datepicker__day--highlighted {
      background-color: #ffeb3b !important;
      color: #000 !important;
      border-radius: 50% !important;
    }
  `;

  // Use watch to observe date changes
  const selectedDate = watch('date');

  // Filter time slots based on selected date
  const filteredTimeSlots = useMemo(() => {
    if (!selectedDate) return [];
    
    const formattedSelectedDate = selectedDate.toISOString().split('T')[0];
    
    return doctorSlots.filter(slot => 
      new Date(slot.slot_date).toISOString().split('T')[0] === formattedSelectedDate
    );
  }, [selectedDate, doctorSlots]);

  // Update parent component when filtered slots change
  React.useEffect(() => {
    onDateChange(filteredTimeSlots);
  }, [filteredTimeSlots, onDateChange]);

  return (
    <>
      <style>{customDatePickerStyles}</style>
      <Controller
        name="date"
        control={control} 
        defaultValue={null}
        rules={{ required: "Date is required" }}
        render={({ field }) => (
        
          <DatePicker
            selected={field.value}
            onChange={field.onChange}
            highlightDates={highlightedDates}
            placeholderText="Select a date"
            className="mt-1 w-full border border-gray-500 rounded-md p-2"
            dayClassName={(date) => 
              highlightedDates.some(
                (highlightedDate) => 
                  highlightedDate.toDateString() === date.toDateString()
              )
                ? 'react-datepicker__day--highlighted'
                : undefined
            }
          />
        
        )}
      />
    </>
  );
}