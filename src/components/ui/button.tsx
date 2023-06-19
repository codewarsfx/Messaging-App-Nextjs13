import { ButtonHTMLAttributes, FC } from "react";
import { VariantProps, cva } from "class-variance-authority";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";



//first argument ...styles always applied to 
const ButtonVariants = cva(
	"active:scale-95 inline-flex items-center justify-center rounded-md text-sm font-medium transition-color focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 disabled:opactiy-50 disabled:pointer-events-none",
	{
		// here we define the styles for the button variants
        variants: {  
            //btn variants styling
			variant: {
				default: "bg-slate-900 text-white hover:bg-slate-800",
				ghost: "bg-transparent hover:text-slate-900 hover:bg-slate-200",
            },
            //btn varients size styling 
            size: {
                //default sz
                default: 'h-10 py-2 px-4',
                sm: 'h-9 px-2',
                lg:'h-11 px-8'
            }
        },
        // here we initialize the default variants
        defaultVariants: {
            variant: "default",
            size:"default"
        }
	}
);

export interface buttonProps extends ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof ButtonVariants>{

    isLoading?: boolean
}

//method to create reusable button variants

const Button: FC<buttonProps> = ({isLoading,children,className,variant,size,...otherProps}) => {
    return <button className={cn(ButtonVariants({ variant, size, className}))} disabled={isLoading} {...otherProps} >
        {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
        {children}
    </button>
};

export default Button;
