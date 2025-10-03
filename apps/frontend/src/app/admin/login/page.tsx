"use client";

import React, { JSX, useState, useCallback, memo } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { loginSuccess } from "@/store/slices/auth-slice";
import { useLoginMutation } from "@/services/api";
import { motion } from "framer-motion";

// Memoized schema to prevent recreation
const loginSchema = z.object({
	email: z.string().email("Please enter a valid email address"),
	password: z.string().min(6, "Password must be at least 6 characters"),
});

type LoginInput = z.infer<typeof loginSchema>;

// Optimized animation variants
const containerVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: "easeOut",
      staggerChildren: 0.1,
    },
  },
} as const;

const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { 
      duration: 0.3, 
      ease: "easeOut" 
    } 
  },
} as const;

const AdminLoginPage = (): JSX.Element => {
	const dispatch = useDispatch();
	const router = useRouter();
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [error, setError] = useState<string>("");
	const [login] = useLoginMutation();
	
	const {
		handleSubmit,
		register,
		formState: { errors },
	} = useForm<LoginInput>({ 
		resolver: zodResolver(loginSchema),
		mode: "onBlur" // Validate on blur for better UX
	});

	const handleLogin = useCallback(async (data: LoginInput): Promise<void> => {
		if (isLoading) return;
		setIsLoading(true);
		setError("");
		
		try {
			const res = await login(data).unwrap();
			dispatch(loginSuccess({ token: res.accessToken, role: "admin" }));
			router.replace("/admin/posts");
		} catch (err: any) {
			setError(err?.data?.message || "Login failed. Check email and password.");
		} finally {
			setIsLoading(false);
		}
	}, [isLoading, login, dispatch, router]);

	return (
		<motion.div 
			className="max-w-md mx-auto hide-scrollbar"
			variants={containerVariants}
			initial="hidden"
			animate="visible"
		>
			<motion.h2 
				className="text-2xl font-semibold mb-6"
				variants={itemVariants}
			>
				Admin Login
			</motion.h2>
			
			{error && (
				<motion.div 
					className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded"
					variants={itemVariants}
					initial={{ opacity: 0, scale: 0.95 }}
					animate={{ opacity: 1, scale: 1 }}
				>
					{error}
				</motion.div>
			)}
			
			<motion.form 
				onSubmit={handleSubmit(handleLogin)} 
				className="space-y-4" 
				aria-label="Admin login form"
				variants={itemVariants}
			>
				<motion.label className="block" htmlFor="email" variants={itemVariants}>
					<span className="block text-sm font-medium mb-1">Email</span>
					<input
						id="email"
						type="email"
						{...register("email")}
						className="w-full rounded-md border px-3 py-2 transition-colors focus:border-blue-500 focus:outline-none"
						placeholder="you@example.com"
						aria-invalid={Boolean(errors.email)}
						aria-describedby="email-error"
						tabIndex={0}
						autoComplete="email"
					/>
					{errors.email && (
						<p id="email-error" className="text-sm text-red-600 mt-1">
							{errors.email.message}
						</p>
					)}
				</motion.label>
				
				<motion.label className="block" htmlFor="password" variants={itemVariants}>
					<span className="block text-sm font-medium mb-1">Password</span>
					<input
						id="password"
						type="password"
						{...register("password")}
						className="w-full rounded-md border px-3 py-2 transition-colors focus:border-blue-500 focus:outline-none"
						placeholder="••••••••"
						aria-invalid={Boolean(errors.password)}
						aria-describedby="password-error"
						tabIndex={0}
						autoComplete="current-password"
					/>
					{errors.password && (
						<p id="password-error" className="text-sm text-red-600 mt-1">
							{errors.password.message}
						</p>
					)}
				</motion.label>
				
				<motion.button
					type="submit"
					disabled={isLoading}
					className="w-full inline-flex items-center justify-center rounded-md bg-black text-white px-4 py-2 disabled:opacity-50 hover:bg-gray-800 transition-colors"
					variants={itemVariants}
					whileHover={{ scale: 1.02 }}
					whileTap={{ scale: 0.98 }}
				>
					{isLoading ? (
						<>
							<div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
							Signing in...
						</>
					) : (
						"Sign in"
					)}
				</motion.button>
			</motion.form>
		</motion.div>
	);
};

export default AdminLoginPage;
