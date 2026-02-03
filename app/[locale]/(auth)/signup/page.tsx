'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { FcGoogle } from 'react-icons/fc';
import { FaOrcid } from 'react-icons/fa';
import { useState } from 'react';
import { Calendar } from '@/components/ui/calendar';
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from '@/components/ui/input-group';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { CalendarIcon } from 'lucide-react';
import { CountryDropdown, Country } from '@/components/ui/country-dropdown';

function formatDate(date: Date | undefined) {
  if (!date) {
    return '';
  }
  return date.toLocaleDateString('en-US', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });
}

function isValidDate(date: Date | undefined) {
  if (!date) {
    return false;
  }
  return !isNaN(date.getTime());
}

const signupSchema = z
  .object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    email: z.string().email('Please enter a valid email address'),
    dateOfBirth: z.string().min(1, 'Please select your date of birth'),
    country: z.string().min(1, 'Please select your country'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    confirmPassword: z.string(),
    termsAccepted: z.boolean().refine(val => val === true, {
      message: 'You must agree to the privacy policy to continue',
    }),
  })
  .refine(data => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

type SignupFormData = z.infer<typeof signupSchema>;

export default function SignupPage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
  });

  const [openDatePicker, setOpenDatePicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [dateMonth, setDateMonth] = useState<Date | undefined>(undefined);
  const [dateValue, setDateValue] = useState('');
  const [isTermsAccepted, setIsTermsAccepted] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState('');

  const onSubmit = (data: SignupFormData) => {
    console.log('Signup data:', data);
    // TODO: signup logic
  };

  return (
    <Card className="w-full max-w-md mx-4">
      <CardHeader>
        <CardTitle>Create an account</CardTitle>
        <CardDescription>
          Enter your information to create an account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)}>
          <FieldGroup>
            {/* Email Field */}
            <Field>
              <FieldLabel htmlFor="email">Email</FieldLabel>
              <Input
                id="email"
                type="email"
                placeholder="im@example.com"
                {...register('email')}
              />
              {errors.email && (
                <p className="text-sm text-destructive mt-1">
                  {errors.email.message}
                </p>
              )}
            </Field>

            {/* Password Field */}
            <Field>
              <FieldLabel htmlFor="password">Password</FieldLabel>
              <Input id="password" type="password" {...register('password')} />
              {errors.password && (
                <p className="text-sm text-destructive mt-1">
                  {errors.password.message}
                </p>
              )}
            </Field>

            {/* Confirm Password Field */}
            <Field>
              <FieldLabel htmlFor="confirmPassword">
                Confirm Password
              </FieldLabel>
              <Input
                id="confirmPassword"
                type="password"
                {...register('confirmPassword')}
              />
              {errors.confirmPassword && (
                <p className="text-sm text-destructive mt-1">
                  {errors.confirmPassword.message}
                </p>
              )}
            </Field>

            {/* Name Field */}
            <Field>
              <FieldLabel htmlFor="name">Name</FieldLabel>
              <Input id="name" type="text" {...register('name')} />
              {errors.name && (
                <p className="text-sm text-destructive mt-1">
                  {errors.name.message}
                </p>
              )}
            </Field>

            {/* Date of Birth Field */}
            <Field>
              <FieldLabel htmlFor="dateOfBirth">Date of Birth</FieldLabel>
              <InputGroup>
                <InputGroupInput
                  id="dateOfBirth"
                  value={dateValue}
                  placeholder="Select your date of birth"
                  onChange={e => {
                    const date = new Date(e.target.value);
                    setDateValue(e.target.value);
                    if (isValidDate(date)) {
                      setSelectedDate(date);
                      setDateMonth(date);
                      setValue('dateOfBirth', date.toISOString().split('T')[0]);
                    }
                  }}
                  onKeyDown={e => {
                    if (e.key === 'ArrowDown') {
                      e.preventDefault();
                      setOpenDatePicker(true);
                    }
                  }}
                />
                <InputGroupAddon align="inline-end">
                  <Popover
                    open={openDatePicker}
                    onOpenChange={setOpenDatePicker}
                  >
                    <PopoverTrigger asChild>
                      <InputGroupButton
                        variant="ghost"
                        size="icon-xs"
                        aria-label="Select date"
                      >
                        <CalendarIcon />
                      </InputGroupButton>
                    </PopoverTrigger>
                    <PopoverContent
                      className="w-auto overflow-hidden p-0"
                      align="end"
                      alignOffset={-8}
                      sideOffset={10}
                    >
                      <Calendar
                        mode="single"
                        selected={selectedDate}
                        month={dateMonth}
                        onMonthChange={setDateMonth}
                        onSelect={date => {
                          setSelectedDate(date);
                          setDateValue(formatDate(date));
                          setValue(
                            'dateOfBirth',
                            date ? date.toISOString().split('T')[0] : ''
                          );
                          setOpenDatePicker(false);
                        }}
                        disabled={date => date > new Date()}
                      />
                    </PopoverContent>
                  </Popover>
                </InputGroupAddon>
              </InputGroup>
              {errors.dateOfBirth && (
                <p className="text-sm text-destructive mt-1">
                  {errors.dateOfBirth.message}
                </p>
              )}
            </Field>

            {/* Country Field */}
            <Field>
              <FieldLabel htmlFor="country">Country</FieldLabel>
              <CountryDropdown
                value={selectedCountry}
                onChange={(country: Country) => {
                  setSelectedCountry(country.alpha2);
                  setValue('country', country.alpha2);
                }}
                placeholder="Select a country"
              />
              {errors.country && (
                <p className="text-sm text-destructive mt-1">
                  {errors.country.message}
                </p>
              )}
            </Field>

            {/* Terms and Conditions Field */}
            <Field>
              <div className="flex items-start space-x-2">
                <Checkbox
                  id="termsAccepted"
                  {...register('termsAccepted')}
                  onCheckedChange={checked => {
                    const isChecked = checked as boolean;
                    setValue('termsAccepted', isChecked);
                    setIsTermsAccepted(isChecked);
                  }}
                />
                <div className="grid gap-1.5 leading-none">
                  <label
                    htmlFor="termsAccepted"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    You read and agree to the{' '}
                    <a
                      href="/privacy-statement"
                      target="_blank"
                      className="underline underline-offset-4 hover:text-primary"
                    >
                      Privacy Statement
                    </a>
                  </label>
                </div>
              </div>
              {errors.termsAccepted && (
                <p className="text-sm text-destructive mt-1">
                  {errors.termsAccepted.message}
                </p>
              )}
            </Field>

            {/* Submit Button */}
            <Field>
              <Button
                type="submit"
                className="w-full"
                disabled={!isTermsAccepted}
              >
                Create account
              </Button>

              <div className="relative my-4">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs">
                  <span className="bg-background px-2 text-muted-foreground">
                    or continue with
                  </span>
                </div>
              </div>

              <Field>
                <Button variant="outline" type="button" className="w-full">
                  <FcGoogle className="mr-2 h-4 w-4" />
                  Google
                </Button>
                <Button variant="outline" type="button" className="w-full mt-2">
                  <FaOrcid className="mr-2 h-4 w-4" />
                  Orcid
                </Button>
              </Field>

              <FieldDescription className="text-center">
                Already have an account?{' '}
                <a href="/login" className="underline">
                  Log in
                </a>
              </FieldDescription>
            </Field>
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  );
}
