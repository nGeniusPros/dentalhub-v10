import React, { useState } from 'react';
import {
  Button,
  Input,
} from "../ui"; // Dialog and Select components will be imported from Radix
import * as RadixDialog from '@radix-ui/react-dialog';
import * as RadixSelect from '@radix-ui/react-select';
import { NexHealthCreatePatientPayload, PatientDetailsData } from '../../types/nexhealth';

interface AddPatientDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onAddPatient: (payload: NexHealthCreatePatientPayload) => Promise<PatientDetailsData>; // Changed from Promise<any>
}

const AddPatientDialog = ({ isOpen, onClose, onAddPatient }: AddPatientDialogProps) => {
  const initialFormData = {
    first_name: '',
    last_name: '',
    email: '',
    provider_id: '', // Will be parsed to number
    bio: {
      date_of_birth: '', // YYYY-MM-DD
      phone_number: '',
      gender: 'unknown' as 'male' | 'female' | 'other' | 'unknown',
      address_line_1: '',
      city: '',
      state: '',
      zip_code: '',
    },
  };
  const [formData, setFormData] = useState(initialFormData);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    const [, subField] = name.split('.'); // Changed [field, subField] to [, subField]

    if (subField) {
      setFormData(prev => ({
        ...prev,
        bio: { // Directly target bio
          ...prev.bio,
          [subField]: value,
        },
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value,
      }));
    }
  };
  
  // Specific handler for Select component as its onChange provides value directly
  const handleGenderChange = (value: 'male' | 'female' | 'other' | 'unknown') => {
    setFormData(prev => ({
      ...prev,
      bio: {
        ...prev.bio,
        gender: value,
      },
    }));
  };


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);
    setIsSubmitting(true);

    const payload: NexHealthCreatePatientPayload = {
      patient: {
        first_name: formData.first_name,
        last_name: formData.last_name,
        email: formData.email || undefined,
        bio: {
          date_of_birth: formData.bio.date_of_birth,
          phone_number: formData.bio.phone_number,
          gender: formData.bio.gender,
          address_line_1: formData.bio.address_line_1 || undefined,
          city: formData.bio.city || undefined,
          state: formData.bio.state || undefined,
          zip_code: formData.bio.zip_code || undefined,
        },
      },
    };
    if (formData.provider_id && !isNaN(parseInt(formData.provider_id, 10))) {
      payload.provider = { provider_id: parseInt(formData.provider_id, 10) };
    }


    try {
      await onAddPatient(payload);
      setFormData(initialFormData); 
      // onClose(); // Parent will handle closing on successful submission if desired
    } catch (error) {
      console.error("Error adding patient:", error);
      setSubmitError(error instanceof Error ? error.message : "Failed to add patient. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <RadixDialog.Root open={isOpen} onOpenChange={(open) => { if (!open) { onClose(); setSubmitError(null); setFormData(initialFormData); } }}>
      <RadixDialog.Content className="sm:max-w-[525px]">
        <div>
          <RadixDialog.Title>Add New Patient</RadixDialog.Title>
          <RadixDialog.Description>
            Fill in the details below to create a new patient record.
          </RadixDialog.Description>
        </div>
        <form onSubmit={handleSubmit} className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <label htmlFor="first_name" className="text-right">First Name</label>
            <Input id="first_name" name="first_name" value={formData.first_name} onChange={handleChange} required className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <label htmlFor="last_name" className="text-right">Last Name</label>
            <Input id="last_name" name="last_name" value={formData.last_name} onChange={handleChange} required className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <label htmlFor="email" className="text-right">Email</label>
            <Input id="email" name="email" type="email" value={formData.email} onChange={handleChange} className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <label htmlFor="bio.phone_number" className="text-right">Phone</label>
            <Input id="bio.phone_number" name="bio.phone_number" value={formData.bio.phone_number} onChange={handleChange} required placeholder="(555) 123-4567" className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <label htmlFor="bio.date_of_birth" className="text-right">Date of Birth</label>
            <Input id="bio.date_of_birth" name="bio.date_of_birth" type="date" value={formData.bio.date_of_birth} onChange={handleChange} required className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <label htmlFor="bio.gender" className="text-right">Gender</label>
            <RadixSelect.Root name="bio.gender" value={formData.bio.gender} onValueChange={handleGenderChange}>
              <RadixSelect.Trigger className="col-span-3">
                <RadixSelect.Value placeholder="Select gender" />
              </RadixSelect.Trigger>
              <RadixSelect.Content>
                <RadixSelect.Item value="male">Male</RadixSelect.Item>
                <RadixSelect.Item value="female">Female</RadixSelect.Item>
                <RadixSelect.Item value="other">Other</RadixSelect.Item>
                <RadixSelect.Item value="unknown">Unknown</RadixSelect.Item>
              </RadixSelect.Content>
            </RadixSelect.Root>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <label htmlFor="provider_id" className="text-right">Provider ID</label>
            <Input id="provider_id" name="provider_id" type="number" value={formData.provider_id} onChange={handleChange} placeholder="e.g., 123 (Optional)" className="col-span-3" />
          </div>
          
          <h3 className="col-span-4 text-sm font-medium text-gray-500 mt-2">Optional Address</h3>
          <div className="grid grid-cols-4 items-center gap-4">
            <label htmlFor="bio.address_line_1" className="text-right">Street</label>
            <Input id="bio.address_line_1" name="bio.address_line_1" value={formData.bio.address_line_1} onChange={handleChange} className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <label htmlFor="bio.city" className="text-right">City</label>
            <Input id="bio.city" name="bio.city" value={formData.bio.city} onChange={handleChange} className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <label htmlFor="bio.state" className="text-right">State</label>
            <Input id="bio.state" name="bio.state" value={formData.bio.state} onChange={handleChange} className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <label htmlFor="bio.zip_code" className="text-right">Zip Code</label>
            <Input id="bio.zip_code" name="bio.zip_code" value={formData.bio.zip_code} onChange={handleChange} className="col-span-3" />
          </div>

          {submitError && <p className="col-span-4 text-red-600 text-sm">{submitError}</p>}
          
          <div>
            <Button type="button" variant="outline" onClick={() => { onClose(); setSubmitError(null); setFormData(initialFormData); }} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Adding...' : 'Add Patient'}
            </Button>
          </div>
        </form>
      </RadixDialog.Content>
    </RadixDialog.Root>
  );
};

export default AddPatientDialog;
