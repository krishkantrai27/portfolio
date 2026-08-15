import { useState, useRef } from 'preact/hooks'

type StatusType = {
    status: boolean,
    message: string
}

const ContactForm = () => {
    const [mailStatus, setMailStatus] = useState<StatusType>({ status: false, message: "" })
    const [isLoading, setisLoading] = useState<boolean>(false)

    const NameRef = useRef<HTMLInputElement>(null)
    const EmailRef = useRef<HTMLInputElement>(null)
    const MessageRef = useRef<HTMLTextAreaElement>(null)

    const HandleFormSubmit = async (e: SubmitEvent) => {
        e.preventDefault();

        if (!NameRef.current || !EmailRef.current || !MessageRef.current) return

        const name = NameRef.current.value.trim();
        const email = EmailRef.current.value.trim();
        const message = MessageRef.current.value.trim();

        if (!name) {
            setMailStatus({ status: false, message: "⚠️ Please enter your name." });
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            setMailStatus({ status: false, message: "🙄 Invalid Email ID!" });
            return;
        }

        if (!message) {
            setMailStatus({ status: false, message: "⚠️ Please write a message." });
            return;
        }

        setisLoading(true);

        const serviceId = import.meta.env.PUBLIC_EMAILJS_SERVICE_ID;
        const templateId = import.meta.env.PUBLIC_EMAILJS_TEMPLATE_ID;
        const publicKey = import.meta.env.PUBLIC_EMAILJS_PUBLIC_KEY;

        const fallbackMailto = () => {
            const subject = encodeURIComponent(`Portfolio Inquiry from ${name}`);
            const body = encodeURIComponent(
                `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`
            );
            window.location.href = `mailto:krishkantrai2006@gmail.com?subject=${subject}&body=${body}`;
            setMailStatus({ status: true, message: "👍 Opening your email client to send!" });
        };

        if (serviceId && templateId && publicKey) {
            try {
                const { default: emailjs } = await import('@emailjs/browser');
                const templateParams = {
                    from_name: name,
                    from_email: email,
                    message: message,
                };

                const mailRes = await emailjs.send(serviceId, templateId, templateParams, publicKey);

                if (mailRes.status === 200) {
                    setMailStatus({ status: true, message: "👍 Message Sent Successfully!" });
                    NameRef.current.value = "";
                    EmailRef.current.value = "";
                    MessageRef.current.value = "";
                } else {
                    fallbackMailto();
                }
            } catch {
                fallbackMailto();
            } finally {
                setisLoading(false);
                setTimeout(() => {
                    setMailStatus({ status: false, message: "" });
                }, 5000);
            }
        } else {
            fallbackMailto();
            setisLoading(false);
            setTimeout(() => {
                setMailStatus({ status: false, message: "" });
            }, 5000);
        }
    }

    return (
        <form onSubmit={HandleFormSubmit} className="Fade_Up LinkBtnGradient rounded-md w-full lg:max-w-[650px] px-4 py-2 outline outline-white/20 flex_center flex-col">
            <label
                htmlFor="name"
                className="noCustomCursor w-full h-fit flex justify-center items-start flex-col px-1 py-2"
            >
                Name
                <input
                    type="text"
                    id="name"
                    name="name"
                    placeholder="Enter your Name"
                    className="w-full p-2 mt-1 rounded-md border-none outline-none bg-background text-foreground"
                    autoComplete='name'
                    required
                    ref={NameRef} />
            </label>
            <label
                htmlFor="email"
                className="noCustomCursor w-full h-fit flex justify-center items-start flex-col px-1 py-2"
            >
                Email
                <input
                    type="email"
                    id="email"
                    name="email"
                    placeholder="example@gmail.com"
                    className="w-full p-2 mt-1 rounded-md border-none outline-none bg-background text-foreground"
                    autoComplete='email'
                    required
                    ref={EmailRef} />
            </label>
            <label
                htmlFor="message"
                className="noCustomCursor w-full h-fit flex justify-center items-start flex-col px-1 py-2"
            >
                Message
                <textarea
                    rows={5}
                    id="message"
                    name="message"
                    placeholder="Enter your Message"
                    className="w-full p-2 mt-1 rounded-md border-none outline-none bg-background text-foreground resize-none"
                    required
                    ref={MessageRef} />
            </label>

            <div className="w-full flex flex-wrap justify-start items-center gap-4 py-2">
                <button
                    className="flex_center gap-4 border-none bg-background text-foreground outline outline-white/20 my-1 mx-2 py-2 px-6 lg:px-14 rounded-md cursor-pointer hover:bg-background/80 transition-colors"
                    type="submit"
                    disabled={isLoading}
                >
                    {
                        isLoading ? (
                            <>
                                <span>Sending</span>
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" class="lucide lucide-loader-2 animate-spin"><path d="M21 12a9 9 0 1 1-6.219-8.56" /></svg>
                            </>
                        ) : (
                            <>
                                <span>Submit</span>
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-send-horizontal"><path d="m3 3 3 9-3 9 19-9Z" /><path d="M6 12h16" /></svg>
                            </>
                        )
                    }
                </button>
                {mailStatus.message && (
                    <span class={`text-sm font-medium ${mailStatus.status ? 'text-green-400' : 'text-amber-400'}`}>
                        {mailStatus.message}
                    </span>
                )}
            </div>
        </form>
    )
}

export default ContactForm