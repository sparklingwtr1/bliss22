import React, { useState } from 'react';
import { ModalContainer, Overlay, Title, Form, CheckboxContainer, DateContainer, DateRow, Label, Input, ApplyButton, CloseButton, ButtonContainer } from '../design/filtermodaldesign';

const FilterModal = ({ isOpen, onClose, columns, selectedColumns, onColumnChange, onDateRangeChange }) => {
  const [dateFrom, setDateFrom] = useState('');
  const [dateUntil, setDateUntil] = useState('');

  if (!isOpen) return null;

  const handleDateRangeChange = () => {
    onDateRangeChange(dateFrom, dateUntil);
  };

  return (
    <>
      <Overlay />
      <ModalContainer>
        <Title>Filter Columns</Title>
        <Form>
          {columns.map((column) => (
            column !== 'DATE RECEIVED' ? (
              <CheckboxContainer key={column}>
                <Label>
                  <Input
                    type="checkbox"
                    checked={selectedColumns.includes(column)}
                    onChange={() => onColumnChange(column)}
                  />
                  {column}
                </Label>
              </CheckboxContainer>
            ) : (
              <DateContainer key={column}>
                <Label>{column}</Label>
                <DateRow>
                  <Label>
                    From:
                    <Input
                      type="date"
                      value={dateFrom}
                      onChange={(e) => setDateFrom(e.target.value)}
                    />
                  </Label>
                  <Label>
                    Until:
                    <Input
                      type="date"
                      value={dateUntil}
                      onChange={(e) => setDateUntil(e.target.value)}
                    />
                  </Label>
                </DateRow>
                <ButtonContainer>
                  <ApplyButton type="button" onClick={handleDateRangeChange}>Apply</ApplyButton>
                </ButtonContainer>
              </DateContainer>
            )
          ))}
        </Form>
        <ButtonContainer>
          <CloseButton onClick={onClose}>Close</CloseButton>
        </ButtonContainer>
      </ModalContainer>
    </>
  );
};

export default FilterModal;