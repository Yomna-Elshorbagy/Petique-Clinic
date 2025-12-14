import { useState } from "react";
import { motion } from "framer-motion";
import { PawPrint, Phone, MapPin, Mail, Cat, Dog } from "lucide-react";
import { sendContact } from "../../Apis/ContactApis";
import Swal from "sweetalert2";
import { useTranslation } from "react-i18next";
import type { ContactForm } from "../../Interfaces/IContact ";
import QrSection from "../../Components/Qrcode/Qrcode";

export default function ContactUs() {
  const { t } = useTranslation();
  const [form, setForm] = useState<ContactForm>({
    fullName: "",
    email: "",
    message: "",
    category: "",
    urgency: "",
    petAge: "",
  });

  const [loading, setLoading] = useState<boolean>(false);
  const [success, setSuccess] = useState<string>("");

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setLoading(true);
      await sendContact(form);
      setSuccess(t("contactUs.successMessage"));

      Swal.fire({
        icon: "success",
        title: t("contactUs.successTitle"),
        text: t("contactUs.successMessage"),
        confirmButtonColor: "#C58D52",
        background: "#FCF9F4",
      });

      setForm({
        fullName: "",
        email: "",
        message: "",
        category: "",
        urgency: "",
        petAge: "",
      });
    } catch (err: any) {
      Swal.fire({
        icon: "error",
        title: t("contactUs.errorTitle"),
        text: err.response?.data?.message || t("contactUs.errorMessage"),
        confirmButtonColor: "#C58D52",
        background: "#FCF9F4",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="relative min-h-screen bg-[var(--color-light-background)] flex items-center justify-center py-16 px-6 overflow-hidden transition-colors duration-300">
        <motion.div
          animate={{ y: [0, -20, 0] }}
          transition={{ duration: 4, repeat: Infinity }}
          className="absolute top-26 left-10 opacity-40 pointer-events-none"
        >
          <Cat size={80} className="text-[var(--color-light-secondary)]" />
        </motion.div>

        <motion.div
          animate={{ y: [0, -25, 0] }}
          transition={{ duration: 4, repeat: Infinity }}
          className="absolute top-90 right-10 opacity-40 pointer-events-none"
        >
          <Dog size={90} className="text-[var(--color-light-dark)]" />
        </motion.div>

        <div className="w-full max-w-6xl grid md:grid-cols-2 gap-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="bg-[var(--color-bg-lighter)] rounded-3xl shadow-xl p-6 border border-[var(--color-border-medium)]/30"
          >
            <h2 className="text-2xl font-bold text-[var(--color-text-primary)] flex items-center gap-2 mb-4">
              <MapPin className="text-[var(--color-light-accent)]" /> {t("contactUs.ourLocation")}
            </h2>

            <div className="rounded-2xl overflow-hidden shadow-lg mb-4">
              <iframe
                title="clinic map"
                src="https://maps.google.com/maps?q=pet%20clinic&t=&z=13&ie=UTF8&iwloc=&output=embed"
                className="w-full h-64 border-0"
                loading="lazy"
              ></iframe>
            </div>

            <div className="space-y-3 text-[var(--color-text-primary)]">
              <p className="flex items-center gap-3">
                <Phone className="text-[var(--color-light-accent)]" /> +20 0123456789
              </p>

              <p className="flex items-center gap-3">
                <Mail className="text-[var(--color-light-accent)]" /> support@petique.com
              </p>

              <p className="flex items-center gap-3">
                <PawPrint className="text-[var(--color-light-accent)]" />{" "}
                {t("contactUs.openHours")}
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="bg-[var(--color-bg-lighter)] rounded-3xl shadow-xl p-8 border border-[var(--color-border-medium)]/30"
          >
            <h2 className="text-3xl font-bold text-[var(--color-text-primary)] mb-2 flex items-center gap-2">
              <PawPrint className="text-[var(--color-light-accent)]" /> {t("contactUs.title")}
            </h2>
            {success && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="p-4 rounded-xl bg-green-100 text-green-700 mb-4"
              >
                {success}
              </motion.div>
            )}
            <form className="space-y-4" onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="text"
                  name="fullName"
                  required
                  value={form.fullName}
                  onChange={handleChange}
                  placeholder={t("contactUs.fullName")}
                  className="input-box bg-[var(--color-light-background)] border-[var(--color-border-medium)]/50 text-[var(--color-text-primary)] focus:border-[var(--color-light-accent)]"
                />

                <input
                  type="email"
                  name="email"
                  required
                  value={form.email}
                  onChange={handleChange}
                  placeholder={t("contactUs.email")}
                  className="input-box bg-[var(--color-light-background)] border-[var(--color-border-medium)]/50 text-[var(--color-text-primary)] focus:border-[var(--color-light-accent)]"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <select
                  name="category"
                  value={form.category}
                  onChange={handleChange}
                  className="input-box bg-[var(--color-light-background)] border-[var(--color-border-medium)]/50 text-[var(--color-text-primary)] focus:border-[var(--color-light-accent)]"
                >
                  <option value="">{t("contactUs.category")}</option>
                  <option value="general">
                    {t("contactUs.categoryOptions.general")}
                  </option>
                  <option value="appointment">
                    {t("contactUs.categoryOptions.appointment")}
                  </option>
                  <option value="health">
                    {t("contactUs.categoryOptions.health")}
                  </option>
                  <option value="emergency">
                    {t("contactUs.categoryOptions.emergency")}
                  </option>
                  <option value="vaccination">
                    {t("contactUs.categoryOptions.vaccination")}
                  </option>
                </select>

                <select
                  name="urgency"
                  value={form.urgency}
                  onChange={handleChange}
                  className="input-box bg-[var(--color-light-background)] border-[var(--color-border-medium)]/50 text-[var(--color-text-primary)] focus:border-[var(--color-light-accent)]"
                >
                  <option value="">{t("contactUs.urgency")}</option>
                  <option value="high">
                    {t("contactUs.urgencyOptions.high")}
                  </option>
                  <option value="medium">
                    {t("contactUs.urgencyOptions.medium")}
                  </option>
                  <option value="low">
                    {t("contactUs.urgencyOptions.low")}
                  </option>
                  <option value="emergency">
                    {t("contactUs.urgencyOptions.emergency")}
                  </option>
                </select>
              </div>

              <input
                name="petAge"
                type="number"
                value={form.petAge}
                onChange={handleChange}
                className="input-box bg-[var(--color-light-background)] border-[var(--color-border-medium)]/50 text-[var(--color-text-primary)] focus:border-[var(--color-light-accent)]"
                placeholder={t("contactUs.petAge")}
              />

              <textarea
                name="message"
                required
                rows={4}
                value={form.message}
                onChange={handleChange}
                placeholder={t("contactUs.describeIssue")}
                className="input-box bg-[var(--color-light-background)] border-[var(--color-border-medium)]/50 text-[var(--color-text-primary)] focus:border-[var(--color-light-accent)]"
              />

              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                disabled={loading}
                className="w-full py-3 rounded-xl text-white text-lg font-semibold shadow-lg
                bg-gradient-to-r from-[var(--color-light-accent)] to-[var(--color-accent-dark)]
                hover:from-[var(--color-accent-dark)] hover:to-[var(--color-light-secondary)]
                transition duration-300"
              >
                {loading ? t("contactUs.sending") : t("contactUs.sendMessage")}
              </motion.button>
            </form>
          </motion.div>
        </div>
      </div>
      <QrSection />
    </>
  );
}
