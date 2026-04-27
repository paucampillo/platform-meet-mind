import { FormEvent, useEffect, useState } from "react";
import { CheckCircle2, Loader2 } from "lucide-react";

import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Input } from "./ui/input";

interface WaitlistModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function WaitlistModal({ open, onOpenChange }: WaitlistModalProps) {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!open) {
      setEmail("");
      setIsSubmitting(false);
      setIsSuccess(false);
      setErrorMessage(null);
    }
  }, [open]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const endpoint = import.meta.env.VITE_FORM_ENDPOINT;
    if (!endpoint) {
      setErrorMessage(
        "Falta configurar VITE_FORM_ENDPOINT en el entorno del frontend.",
      );
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);
    try {
      const formData = new FormData();
      formData.append("email", email.trim());
      formData.append("source", "meetmind-beta-waitlist");

      const response = await fetch(endpoint, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Error ${response.status} al enviar el formulario.`);
      }
      setIsSuccess(true);
    } catch (error: any) {
      setErrorMessage(
        error?.message || "No se pudo enviar el formulario. Inténtalo de nuevo.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        {isSuccess ? (
          <div className="space-y-4 py-2 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
              <CheckCircle2 className="h-6 w-6 text-primary" />
            </div>
            <DialogHeader className="space-y-2">
              <DialogTitle>Gracias por unirte a la beta</DialogTitle>
              <DialogDescription>
                Hemos guardado tu progreso y te contactaremos con acceso prioritario.
              </DialogDescription>
            </DialogHeader>
            <Button onClick={() => onOpenChange(false)} className="w-full">
              Cerrar
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <DialogHeader className="space-y-2">
              <DialogTitle>MeetMind está en Beta Privada</DialogTitle>
              <DialogDescription>
                Introduce tu email para guardar tu progreso y obtener acceso
                prioritario.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-2">
              <label htmlFor="waitlist-email" className="text-sm font-medium">
                Email
              </label>
              <Input
                id="waitlist-email"
                type="email"
                required
                placeholder="tu@email.com"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
              />
            </div>

            {errorMessage && (
              <p className="rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
                {errorMessage}
              </p>
            )}

            <DialogFooter>
              <Button type="submit" disabled={isSubmitting} className="w-full">
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Enviando...
                  </>
                ) : (
                  "Guardar y unirme a la waitlist"
                )}
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
