"use client";
import { FC, useState } from "react";
import Button from "./ui/button";
import { addFriendValidator } from "@/lib/validations/add-friend";
import axios, { AxiosError } from "axios";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

interface addFriendButtonProps {}

type FormData = z.infer<typeof addFriendValidator>;

const AddFriendButton: FC<addFriendButtonProps> = ({}) => {
	const [showSucessState, setShowSucessState] = useState(false);

	const {
		register,
		handleSubmit,
		setError,
		formState: { errors },
	} = useForm<FormData>({
		resolver: zodResolver(addFriendValidator),
	});

    const addFriends = async (email: string) => {
        setShowSucessState(false);
		try {
			const validatedEmail = addFriendValidator.parse({ email });

			await axios.post("/api/friends/add", {
				email: validatedEmail,
			});

			setShowSucessState(true);
		} catch (error) {
			if (error instanceof z.ZodError) {
				setError("email", { message: error.message });
				return;
			}
			if (error instanceof AxiosError) {
				setError("email", { message: error.response?.data });
				return;
			}
			setError("email", { message: "something went wrong" });
		}
	};

	const onSubmit = (data: FormData) => {
		addFriends(data.email);
	};

	return (
		<div>
			<form className='max-w-sm' onSubmit={handleSubmit(onSubmit)}>
				<label
					htmlFor='email'
					className='block text-sm font-medium leading-6 text-gray-900 '
				>
					Add friend by Email
				</label>
				<div className='mt-2 flex gap-4'>
					<input
						{...register("email")}
						type='text'
						className='block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm leading-6'
						placeholder='you@example.com'
					/>
					<Button>Add</Button>
				</div>
				<p className='text-sm mt-1 text-red-600'>{errors.email?.message}</p>
				{showSucessState ? (
					<p className='text-sm mt-1 text-green-600'>Friend request sent</p>
                ) : null
                }
			</form>
		</div>
	);
};

export default AddFriendButton;
