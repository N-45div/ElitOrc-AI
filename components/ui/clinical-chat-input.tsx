"use client";

import * as React from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";
import {
  PaperclipIcon,
  SendIcon,
  MicIcon,
  XIcon,
  FileIcon,
  HeartIcon,
} from "lucide-react";

// --- Utility Function & Radix Primitives ---
type ClassValue = string | number | boolean | null | undefined;
function cn(...inputs: ClassValue[]): string { return inputs.filter(Boolean).join(" "); }

const TooltipProvider = TooltipPrimitive.Provider;
const Tooltip = TooltipPrimitive.Root;
const TooltipTrigger = TooltipPrimitive.Trigger;
const TooltipContent = React.forwardRef<React.ElementRef<typeof TooltipPrimitive.Content>, React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Content> & { showArrow?: boolean }>(({ className, sideOffset = 4, showArrow = false, ...props }, ref) => ( <TooltipPrimitive.Portal><TooltipPrimitive.Content ref={ref} sideOffset={sideOffset} className={cn("relative z-50 max-w-[280px] rounded-md bg-popover text-popover-foreground px-1.5 py-1 text-xs animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2", className)} {...props}>{props.children}{showArrow && <TooltipPrimitive.Arrow className="-my-px fill-popover" />}</TooltipPrimitive.Content></TooltipPrimitive.Portal>));
TooltipContent.displayName = TooltipPrimitive.Content.displayName;

const Popover = PopoverPrimitive.Root;
const PopoverTrigger = PopoverPrimitive.Trigger;
const PopoverContent = React.forwardRef<React.ElementRef<typeof PopoverPrimitive.Content>, React.ComponentPropsWithoutRef<typeof PopoverPrimitive.Content>>(({ className, align = "center", sideOffset = 4, ...props }, ref) => ( <PopoverPrimitive.Portal><PopoverPrimitive.Content ref={ref} align={align} sideOffset={sideOffset} className={cn("z-50 w-64 rounded-xl bg-popover dark:bg-[#303030] p-2 text-popover-foreground dark:text-white shadow-md outline-none animate-in data-[state=open]:fade-in-0 data-[state=closed]:fade-out-0 data-[state=open]:zoom-in-95 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2", className)} {...props} /></PopoverPrimitive.Portal>));
PopoverContent.displayName = PopoverPrimitive.Content.displayName;

const Dialog = DialogPrimitive.Root;
const DialogPortal = DialogPrimitive.Portal;
const DialogTrigger = DialogPrimitive.Trigger;
const DialogOverlay = React.forwardRef<React.ElementRef<typeof DialogPrimitive.Overlay>, React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>>(({ className, ...props }, ref) => ( <DialogPrimitive.Overlay ref={ref} className={cn("fixed inset-0 z-50 bg-black/60 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0", className)} {...props} />));
DialogOverlay.displayName = DialogPrimitive.Overlay.displayName;

const DialogContent = React.forwardRef<React.ElementRef<typeof DialogPrimitive.Content>, React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content>>(({ className, children, ...props }, ref) => ( <DialogPortal><DialogOverlay /><DialogPrimitive.Content ref={ref} className={cn("fixed left-[50%] top-[50%] z-50 grid w-full max-w-[90vw] md:max-w-[800px] translate-x-[-50%] translate-y-[-50%] gap-4 border-none bg-transparent p-0 shadow-none duration-300 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95", className)} {...props}><div className="relative bg-card dark:bg-[#303030] rounded-[28px] overflow-hidden shadow-2xl p-1">{children}<DialogPrimitive.Close className="absolute right-3 top-3 z-10 rounded-full bg-background/50 dark:bg-[#303030] p-1 hover:bg-accent dark:hover:bg-[#515151] transition-all"><XIcon className="h-5 w-5 text-muted-foreground dark:text-gray-200 hover:text-foreground dark:hover:text-white" /><span className="sr-only">Close</span></DialogPrimitive.Close></div></DialogPrimitive.Content></DialogPortal>));
DialogContent.displayName = DialogPrimitive.Content.displayName;

// --- Clinical SVG Icon Components ---
const PlusIcon = (props: React.SVGProps<SVGSVGElement>) => ( <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}> <path d="M12 5V19" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/> <path d="M5 12H19" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/> </svg> );
const Settings2Icon = (props: React.SVGProps<SVGSVGElement>) => ( <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}> <path d="M20 7h-9" /> <path d="M14 17H5" /> <circle cx="17" cy="17" r="3" /> <circle cx="7" cy="7" r="3" /> </svg> );
const SendIcon = (props: React.SVGProps<SVGSVGElement>) => ( <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}> <path d="M12 5.25L12 18.75" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /> <path d="M18.75 12L12 5.25L5.25 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /> </svg> );
const XIcon = (props: React.SVGProps<SVGSVGElement>) => ( <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}> <line x1="18" y1="6" x2="6" y2="18" /> <line x1="6" y1="6" x2="18" y2="18" /> </svg> );
const MicIcon = (props: React.SVGProps<SVGSVGElement>) => ( <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}> <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"></path> <path d="M19 10v2a7 7 0 0 1-14 0v-2"></path> <line x1="12" y1="19" x2="12" y2="23"></line> </svg> );

// Clinical-specific icons
const StethoscopeIcon = (props: React.SVGProps<SVGSVGElement>) => ( <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}> <path d="M4.8 2.3A.3.3 0 1 0 5 2H4a2 2 0 0 0-2 2v5a6 6 0 0 0 6 6v0a6 6 0 0 0 6-6V4a2 2 0 0 0-2-2h-1a.2.2 0 1 0 .3.3" /> <path d="M8 15v1a6 6 0 0 0 6 6v0a6 6 0 0 0 6-6v-4" /> <circle cx="20" cy="10" r="2" /> </svg> );
const BrainIcon = (props: React.SVGProps<SVGSVGElement>) => ( <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}> <path d="M12 5a3 3 0 1 0-5.997.125 4 4 0 0 0-2.526 5.77 4 4 0 0 0 .556 6.588A4 4 0 1 0 12 18Z" /> <path d="M12 5a3 3 0 1 1 5.997.125 4 4 0 0 1 2.526 5.77 4 4 0 0 1-.556 6.588A4 4 0 1 1 12 18Z" /> <path d="M15 13a4.5 4.5 0 0 1-3-4 4.5 4.5 0 0 1-3 4" /> <path d="M17.599 6.5a3 3 0 0 0 .399-1.375" /> <path d="M6.003 5.125A3 3 0 0 0 6.401 6.5" /> <path d="M3.477 10.896a4 4 0 0 1 .585-.396" /> <path d="M19.938 10.5a4 4 0 0 1 .585.396" /> <path d="M6 18a4 4 0 0 1-1.967-.516" /> <path d="M19.967 17.484A4 4 0 0 1 18 18" /> </svg> );
const FileTextIcon = (props: React.SVGProps<SVGSVGElement>) => ( <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}> <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" /> <path d="M14 2v4a2 2 0 0 0 2 2h4" /> <path d="M10 9H8" /> <path d="M16 13H8" /> <path d="M16 17H8" /> </svg> );
const ImageIcon = (props: React.SVGProps<SVGSVGElement>) => ( <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}> <rect width="18" height="18" x="3" y="3" rx="2" ry="2" /> <circle cx="9" cy="9" r="2" /> <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" /> </svg> );
const ActivityIcon = (props: React.SVGProps<SVGSVGElement>) => ( <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}> <path d="M22 12h-2.48a2 2 0 0 0-1.93 1.46l-2.35 8.36a.25.25 0 0 1-.48 0L9.24 2.18a.25.25 0 0 0-.48 0l-2.35 8.36A2 2 0 0 1 4.49 12H2" /> </svg> );


// --- Clinical Chat Input Component ---
export const ClinicalChatInput = React.forwardRef<HTMLTextAreaElement, Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, 'onSubmit'> & { onSubmit?: (message: string, files: File[]) => void }>(
  ({ className, onSubmit, ...props }, ref) => {
    const internalTextareaRef = React.useRef<HTMLTextAreaElement>(null);
    const fileInputRef = React.useRef<HTMLInputElement>(null);
    const [value, setValue] = React.useState("");
    const [uploadedFiles, setUploadedFiles] = React.useState<File[]>([]);
    const [filePreviews, setFilePreviews] = React.useState<string[]>([]);
    const [isImageDialogOpen, setIsImageDialogOpen] = React.useState(false);
    const [selectedImageIndex, setSelectedImageIndex] = React.useState(0);
    const [isRecording, setIsRecording] = React.useState(false);
    const [mediaRecorder, setMediaRecorder] = React.useState<MediaRecorder | null>(null);

    React.useImperativeHandle(ref, () => internalTextareaRef.current!, []);

    React.useLayoutEffect(() => {
      const textarea = internalTextareaRef.current;
      if (textarea) {
        textarea.style.height = "auto";
        const newHeight = Math.min(textarea.scrollHeight, 200);
        textarea.style.height = `${newHeight}px`;
      }
    }, [value]);

    const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setValue(e.target.value);
      if (props.onChange) props.onChange(e);
    };

    const handlePlusClick = () => {
      fileInputRef.current?.click();
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      const files = Array.from(event.target.files || []);
      const newFiles = [...uploadedFiles, ...files];
      setUploadedFiles(newFiles);

      // Create previews for image files
      files.forEach(file => {
        if (file.type.startsWith("image/")) {
          const reader = new FileReader();
          reader.onloadend = () => {
            setFilePreviews(prev => [...prev, reader.result as string]);
          };
          reader.readAsDataURL(file);
        } else {
          setFilePreviews(prev => [...prev, ""]);
        }
      });

      event.target.value = "";
    };

    const handleRemoveFile = (index: number) => {
      const newFiles = uploadedFiles.filter((_, i) => i !== index);
      const newPreviews = filePreviews.filter((_, i) => i !== index);
      setUploadedFiles(newFiles);
      setFilePreviews(newPreviews);
    };

    const startRecording = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const recorder = new MediaRecorder(stream);
        const audioChunks: Blob[] = [];

        recorder.ondataavailable = (event) => {
          audioChunks.push(event.data);
        };

        recorder.onstop = async () => {
          const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
          
          // Use Web Speech API for speech-to-text
          if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
            const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
            const recognition = new SpeechRecognition();
            
            recognition.continuous = false;
            recognition.interimResults = false;
            recognition.lang = 'en-US';

            recognition.onresult = (event: any) => {
              const transcript = event.results[0][0].transcript;
              setValue(prev => prev + (prev ? ' ' : '') + transcript);
            };

            recognition.onerror = (event: any) => {
              console.error('Speech recognition error:', event.error);
            };

            // Start recognition with the audio stream
            recognition.start();
          }
          
          stream.getTracks().forEach(track => track.stop());
        };

        setMediaRecorder(recorder);
        recorder.start();
        setIsRecording(true);
      } catch (error) {
        console.error('Error accessing microphone:', error);
      }
    };

    const stopRecording = () => {
      if (mediaRecorder && isRecording) {
        mediaRecorder.stop();
        setIsRecording(false);
        setMediaRecorder(null);
      }
    };

    const handleVoiceClick = () => {
      if (isRecording) {
        stopRecording();
      } else {
        startRecording();
      }
    };

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      if (value.trim() || uploadedFiles.length > 0) {
        onSubmit?.(value, uploadedFiles);
        setValue("");
        setUploadedFiles([]);
        setFilePreviews([]);
      }
    };

    const hasValue = value.trim().length > 0 || uploadedFiles.length > 0;

    return (
      <form onSubmit={handleSubmit}>
        <div className={cn("flex flex-col rounded-[28px] p-2 shadow-sm transition-colors bg-white border dark:bg-[#303030] dark:border-transparent cursor-text", className)}>
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileChange} 
            className="hidden" 
            accept="image/*,.pdf,.doc,.docx,.txt"
            multiple
          />
          
          {uploadedFiles.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-2 p-2">
              {uploadedFiles.map((file, index) => (
                <div key={index} className="relative">
                  {file.type.startsWith("image/") ? (
                    <Dialog open={isImageDialogOpen && selectedImageIndex === index} onOpenChange={setIsImageDialogOpen}>
                      <button 
                        type="button" 
                        className="transition-transform" 
                        onClick={() => {
                          setSelectedImageIndex(index);
                          setIsImageDialogOpen(true);
                        }}
                      >
                        <img 
                          src={filePreviews[index]} 
                          alt={`Preview ${index + 1}`} 
                          className="h-14 w-14 rounded-lg object-cover" 
                        />
                      </button>
                      <DialogContent>
                        <img 
                          src={filePreviews[index]} 
                          alt={`Full size preview ${index + 1}`} 
                          className="w-full max-h-[95vh] object-contain rounded-[24px]" 
                        />
                      </DialogContent>
                    </Dialog>
                  ) : (
                    <div className="h-14 w-14 rounded-lg bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                      <FileTextIcon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                    </div>
                  )}
                  <button 
                    type="button"
                    onClick={() => handleRemoveFile(index)} 
                    className="absolute -right-1 -top-1 z-10 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-white transition-colors hover:bg-red-600" 
                    aria-label={`Remove ${file.name}`}
                  >
                    <XIcon className="h-3 w-3" />
                  </button>
                  <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white text-xs p-1 rounded-b-lg truncate">
                    {file.name}
                  </div>
                </div>
              ))}
            </div>
          )}
          
          <textarea 
            ref={internalTextareaRef} 
            rows={1} 
            value={value} 
            onChange={handleInputChange} 
            placeholder="Describe symptoms, upload medical images, or ask for clinical guidance..." 
            className="custom-scrollbar w-full resize-none border-0 bg-transparent p-3 text-foreground dark:text-white placeholder:text-muted-foreground dark:placeholder:text-gray-300 focus:ring-0 focus-visible:outline-none min-h-12" 
            {...props} 
          />
          
          <div className="mt-0.5 p-1 pt-0">
            <TooltipProvider delayDuration={100}>
              <div className="flex items-center gap-2">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button type="button" onClick={handlePlusClick} className="flex h-8 w-8 items-center justify-center rounded-full text-foreground dark:text-white transition-colors hover:bg-accent dark:hover:bg-[#515151] focus-visible:outline-none">
                      <PlusIcon className="h-6 w-6" />
                      <span className="sr-only">Attach files</span>
                    </button>
                  </TooltipTrigger>
                  <TooltipContent side="top" showArrow={true}>
                    <p>Attach medical files</p>
                  </TooltipContent>
                </Tooltip>
                

                <div className="ml-auto flex items-center gap-2">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button 
                        type="button" 
                        onClick={handleVoiceClick}
                        className={`flex h-8 w-8 items-center justify-center rounded-full transition-colors focus-visible:outline-none ${
                          isRecording 
                            ? 'bg-red-500 text-white hover:bg-red-600' 
                            : 'text-foreground dark:text-white hover:bg-accent dark:hover:bg-[#515151]'
                        }`}
                      >
                        <MicIcon className={`h-5 w-5 ${isRecording ? 'animate-pulse' : ''}`} />
                        <span className="sr-only">{isRecording ? 'Stop recording' : 'Record voice'}</span>
                      </button>
                    </TooltipTrigger>
                    <TooltipContent side="top" showArrow={true}>
                      <p>{isRecording ? 'Stop recording' : 'Record voice note'}</p>
                    </TooltipContent>
                  </Tooltip>

                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button 
                        type="submit" 
                        disabled={!hasValue} 
                        className="flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none bg-blue-600 text-white hover:bg-blue-700 dark:bg-blue-600 dark:text-white dark:hover:bg-blue-700 disabled:bg-gray-400 dark:disabled:bg-[#515151]"
                      >
                        <SendIcon className="h-6 w-6 text-bold" />
                        <span className="sr-only">Send message</span>
                      </button>
                    </TooltipTrigger>
                    <TooltipContent side="top" showArrow={true}>
                      <p>Send clinical query</p>
                    </TooltipContent>
                  </Tooltip>
                </div>
              </div>
            </TooltipProvider>
          </div>
        </div>
      </form>
    );
  }
);

ClinicalChatInput.displayName = "ClinicalChatInput";
