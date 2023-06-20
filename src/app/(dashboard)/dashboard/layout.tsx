import { Icon, Icons } from "@/components/icons";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { getSession } from "next-auth/react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { FC, ReactNode } from "react";

interface Layoutprops {
	children: ReactNode;
}

interface SidebarOptions {
	id: number;
	name: string;
	href: string;
	Icon: Icon;
}

const sidebarOptions: SidebarOptions[] = [
	{
		id: 1,
		name: "Add friend",
		href: "/dashboard/add",
		Icon: "UserPlus",
	},
];

const Layout = async ({ children }: Layoutprops) => {
	const session = await getServerSession(authOptions);

	if (!session) notFound();
	return (
		<div className='w-full flex h-screen'>
			<div className='flex h-full w-full max-w-xs grow flex-col gap-y-5 overflow-y-auto border-r border-gray-200 bg-white px-6'>
				<Link className='flex h-16 shrink-0 items-center' href='/dashboard'>
					<Icons.Logo className='h-8 w-auto text-indigo-200' />
				</Link>
				<div className='text-xs font-semibold leading-6 text-gray-400'>
					Your chats
				</div>
				<nav className='flex flex-1 flex-col'>
					<ul role='list' className='flex flex-1 flex-col gap-y-7 '>
						<li>//chats</li>
						<li>
							<div className='text-sx font-semibold leading-6 text-gray-400'>
								Overview
							</div>
							<ul role='list' className='-mx-2 mt-2 space-y-1'>
								{sidebarOptions.map((sidebarOption) => {
									const Icon = Icons[sidebarOption.Icon];
									return (
										<li key={sidebarOption.id}>
											<Link
												href={sidebarOption.href}
												className='text-gray-700 hover:text-indigo-600 hover:bg-gray-50 group flex gap-3 rounded-md p-2 text-sm leading-6 font-semibold'
											>
												<span className='text-gray-400 border-gray-200 bg-white group-hover:border-indigo-600 group-hover:text-indigo-600 flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border text-[0.625rem] font-medium'>
													<Icon className='h-4 w-4' />
                                                </span>
                                                <span className="truncate">
                                                    {sidebarOption.name}
                                                </span>
											</Link>
										</li>
									);
								})}
							</ul>
						</li>
					</ul>
				</nav>
			</div>
			{children}
		</div>
	);
};

export default Layout;
