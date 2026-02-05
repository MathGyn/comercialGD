import { useDebouncedInput } from '@/hooks/useDebouncedInput';
import { Input } from '@/components/ui/input';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface DebouncedInputProps {
  value: string;
  onSave: (value: string) => Promise<void>;
  placeholder?: string;
  className?: string;
  type?: string;
  disabled?: boolean;
}

export const DebouncedInput = ({
  value,
  onSave,
  placeholder,
  className,
  type = 'text',
  disabled = false,
}: DebouncedInputProps) => {
  const { value: localValue, onChange, onBlur, onFocus, isSaving } = useDebouncedInput(
    value,
    onSave,
    1000 // 1 segundo de debounce
  );

  return (
    <div className="relative">
      <Input
        type={type}
        value={localValue}
        onChange={(e) => onChange(e.target.value)}
        onBlur={onBlur}
        onFocus={onFocus}
        placeholder={placeholder}
        className={cn(className, isSaving && 'pr-8')}
        disabled={disabled || isSaving}
      />
      {isSaving && (
        <div className="absolute right-2 top-1/2 -translate-y-1/2">
          <Loader2 className="w-3 h-3 animate-spin text-muted-foreground" />
        </div>
      )}
    </div>
  );
};
