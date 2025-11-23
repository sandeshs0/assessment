import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import type { MerchantFormData } from '../../types/merchant';

interface MerchantFormProps {
  initialData?: MerchantFormData;
  onSubmit: (data: MerchantFormData) => Promise<void>;
  onCancel: () => void;
  isSubmitting?: boolean;
}

const merchantSchema = yup.object({
  memberName: yup
    .string()
    .required('Merchant name is required')
    .min(3, 'Name must be at least 3 characters')
    .max(100, 'Name must not exceed 100 characters'),
  memberType: yup
    .string()
    .required('Member type is required')
    .oneOf(['acquirer', 'issuer', 'both'], 'Invalid member type'),
  country: yup
    .string()
    .optional()
    .oneOf(['', 'NPL', 'IND', 'USA', 'GBR'], 'Invalid country code'),
}).required();

export const MerchantForm = ({ 
  initialData, 
  onSubmit, 
  onCancel, 
  isSubmitting = false 
}: MerchantFormProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<MerchantFormData>({
    resolver: yupResolver(merchantSchema),
    defaultValues: initialData || {
      memberName: '',
      memberType: 'acquirer',
      country: '',
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label htmlFor="memberName" className="block text-sm font-medium text-gray-700 mb-1">
          Merchant Name <span className="text-red-500">*</span>
        </label>
        <input
          {...register('memberName')}
          type="text"
          id="memberName"
          className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none ${
            errors.memberName ? 'border-red-500' : 'border-gray-300'
          }`}
          placeholder="Enter merchant name"
          disabled={isSubmitting}
        />
        {errors.memberName && (
          <p className="mt-1 text-sm text-red-600">{errors.memberName.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="memberType" className="block text-sm font-medium text-gray-700 mb-1">
          Member Type <span className="text-red-500">*</span>
        </label>
        <select
          {...register('memberType')}
          id="memberType"
          className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none ${
            errors.memberType ? 'border-red-500' : 'border-gray-300'
          }`}
          disabled={isSubmitting}
        >
          <option value="acquirer">Acquirer</option>
          <option value="issuer">Issuer</option>
          <option value="both">Both</option>
        </select>
        {errors.memberType && (
          <p className="mt-1 text-sm text-red-600">{errors.memberType.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-1">
          Country
        </label>
        <select
          {...register('country')}
          id="country"
          className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none ${
            errors.country ? 'border-red-500' : 'border-gray-300'
          }`}
          disabled={isSubmitting}
        >
          <option value="">Select country</option>
          <option value="NPL">Nepal (NPL)</option>
          <option value="IND">India (IND)</option>
          <option value="USA">United States (USA)</option>
          <option value="GBR">Great Britain (GBR)</option>
        </select>
        {errors.country && (
          <p className="mt-1 text-sm text-red-600">{errors.country.message}</p>
        )}
      </div>

      <div className="flex justify-end gap-3 pt-4">
        <button
          type="button"
          onClick={onCancel}
          disabled={isSubmitting}
          className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? 'Saving...' : initialData ? 'Update Merchant' : 'Create Merchant'}
        </button>
      </div>
    </form>
  );
};
