import React from 'react';
import Modal from './modal';
import { ModalContent, Form, Input, Select, ButtonContainer, Button } from '../design/modaldesign';

const AddModal = ({ isOpen, onClose, onSubmit }) => {
  return (
    <Modal isOpen={isOpen}>
      <ModalContent>
        <Form onSubmit={onSubmit}>
          <Input type="date" name="dateReceived" placeholder="Date Accession" required />
          <Input type="text" name="class" placeholder="Material Category" required />
          <Input type="text" name="author" placeholder="Author" required />
          <Input type="text" name="title" placeholder="Title of Book" required />
          <Input type="text" name="edition" placeholder="Edition" required />
          <Input type="text" name="volume" placeholder="Volume" required />
          <Input type="number" name="pages" placeholder="Pages" required />
          <Input type="text" name="recordOfSource" placeholder="Record of Source" required />
          <Input type="text" name="costPrice" placeholder="Cost Price" required />
          <Input type="text" name="publisher" placeholder="Publisher" required />
          <Input type="number" name="year" placeholder="Year" required />
          <Input type="text" name="barcode" placeholder="Barcode" required />
          <Input type="text" name="department" placeholder="Program" required />
          <Select name="remarks" required>
            <option value="">Select Remark</option>
            <option value="Lost">Lost</option>
            <option value="Damage">Damage</option>
            <option value="Donate">Donate</option>
            <option value="Available">Available</option>
          </Select>
          <ButtonContainer>
            <Button type="button" onClick={onClose}>Cancel</Button>
            <Button type="submit" primary>Add</Button>
          </ButtonContainer>
        </Form>
      </ModalContent>
    </Modal>
  );
};

export default AddModal;