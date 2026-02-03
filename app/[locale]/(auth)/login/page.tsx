'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
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
import { toast } from 'sonner';

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

const forgotPasswordSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
});

type LoginFormData = z.infer<typeof loginSchema>;
type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;

export default function LoginPage() {
  const [mode, setMode] = useState<'login' | 'forgot-password'>('login');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Login form
  const loginForm = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  // Forgot password form
  const forgotPasswordForm = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  // Handle hash change
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.slice(1);
      if (hash === 'forgot-password') {
        setMode('forgot-password');
      } else {
        setMode('login');
      }
    };

    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const onLoginSubmit = (data: LoginFormData) => {
    console.log('Login data:', data);
    // TODO: login logic
    toast.success('Login successful!');
  };

  const onForgotPasswordSubmit = async (formData: ForgotPasswordFormData) => {
    setIsSubmitting(true);
    try {
      // TODO: API call to send reset email with formData.email
      console.log('Sending reset email to:', formData.email);
      await new Promise((resolve) => setTimeout(resolve, 1000));
      toast.success('Password reset instructions sent to your email!');
      forgotPasswordForm.reset();
    } catch (error) {
      toast.error('Failed to send reset instructions. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const switchToForgotPassword = (e: React.MouseEvent) => {
    e.preventDefault();
    window.location.hash = 'forgot-password';
  };

  const switchToLogin = (e: React.MouseEvent) => {
    e.preventDefault();
    window.location.hash = '';
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>{mode === 'login' ? 'Login' : 'Forgot Password'}</CardTitle>
        <CardDescription>
          {mode === 'login'
            ? 'Enter your email below to login to your account'
            : "Enter your email address and we'll send you instructions to reset your password"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {mode === 'login' ? (
          <form onSubmit={loginForm.handleSubmit(onLoginSubmit)}>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="email">Email</FieldLabel>
                <Input
                  id="email"
                  type="email"
                  placeholder="im@example.com"
                  {...loginForm.register('email')}
                />
                {loginForm.formState.errors.email && (
                  <p className="text-sm text-destructive mt-1">
                    {loginForm.formState.errors.email.message}
                  </p>
                )}
              </Field>

              <Field>
                <div className="flex items-center">
                  <FieldLabel htmlFor="password">Password</FieldLabel>
                  <a
                    href="#forgot-password"
                    onClick={switchToForgotPassword}
                    className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                  >
                    Forgot your password?
                  </a>
                </div>
                <Input
                  id="password"
                  type="password"
                  {...loginForm.register('password')}
                />
                {loginForm.formState.errors.password && (
                  <p className="text-sm text-destructive mt-1">
                    {loginForm.formState.errors.password.message}
                  </p>
                )}
              </Field>

              <Field>
                <Button type="submit" className="w-full">
                  Login
                </Button>

                <div className="relative my-4">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t" />
                  </div>
                  <div className="relative flex justify-center text-xs ">
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
                  Don&apos;t have an account?{' '}
                  <a href="/signup" className="underline">
                    Sign up
                  </a>
                </FieldDescription>
              </Field>
            </FieldGroup>
          </form>
        ) : (
          <form onSubmit={forgotPasswordForm.handleSubmit(onForgotPasswordSubmit)}>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="forgot-email">Email</FieldLabel>
                <Input
                  id="forgot-email"
                  type="email"
                  placeholder="im@example.com"
                  {...forgotPasswordForm.register('email')}
                />
                {forgotPasswordForm.formState.errors.email && (
                  <p className="text-sm text-destructive mt-1">
                    {forgotPasswordForm.formState.errors.email.message}
                  </p>
                )}
              </Field>

              <Field>
                <Button type="submit" className="w-full" disabled={isSubmitting}>
                  {isSubmitting ? 'Sending...' : 'Send Reset Instructions'}
                </Button>
              </Field>

              <FieldDescription className="text-center">
                Remember your password?{' '}
                <a href="#" onClick={switchToLogin} className="underline">
                  Back to login
                </a>
              </FieldDescription>
            </FieldGroup>
          </form>
        )}
      </CardContent>
    </Card>
  );
}
