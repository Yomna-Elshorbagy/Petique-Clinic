import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, PawPrint, Heart } from 'lucide-react';
import faqImage from '../../assets/images/faq-vet.jpg';
import styles from './FAQ.module.css';

const faqs = [
  {
    question: 'What are your operating hours?',
    answer: 'We are open Monday through Friday from 8:00 AM to 6:00 PM, and Saturdays from 9:00 AM to 3:00 PM. We are closed on Sundays and public holidays.',
  },
  {
    question: 'Do you offer emergency services?',
    answer: 'Yes, we provide 24/7 emergency veterinary services. For after-hours emergencies, please call our emergency hotline, and our on-call veterinarian will assist you immediately.',
  },
  {
    question: 'What types of pets do you treat?',
    answer: 'We treat a wide variety of pets including dogs, cats, birds, rabbits, guinea pigs, hamsters, reptiles, and other small exotic animals. Contact us if you have questions about your specific pet.',
  },
  {
    question: 'Do you provide boarding services?',
    answer: 'Yes, we offer comfortable boarding facilities for dogs and cats. Our boarding includes daily feeding, exercise, and 24-hour supervision by our caring staff.',
  },
  {
    question: 'How can I prepare my pet for their visit?',
    answer: 'Bring any previous medical records, keep your pet fasted for 8-12 hours if blood work is needed, and bring a stool sample if possible. Keep cats in carriers and dogs on leashes.',
  },
  {
    question: 'How often should my pet have a check-up?',
    answer: 'We recommend annual wellness exams for adult pets and bi-annual exams for senior pets (7+ years for dogs, 10+ years for cats). Puppies and kittens need more frequent visits for vaccinations.',
  },
];

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section id="faq" className={styles.faq}>
      <div className={styles.container}>
        <motion.div
          className={styles.leftColumn}
          initial={{ opacity: 0, x: -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: [0.4, 0, 0.2, 1] }}
        >
          <span className={styles.subtitle}>
            Feel free to ask details? <PawPrint size={18} className={styles.pawIcon} />
          </span>
          <h2 className={styles.title}>Frequently Asked Questions</h2>
          
          <motion.div 
            className={styles.imageWrapper}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className={styles.imageInner}>
              <img 
                src={faqImage} 
                alt="Veterinarian caring for a happy pet" 
                className={styles.faqImage}
              />
              <div className={styles.decorBadge}>
                <Heart size={14} /> We Care
              </div>
            </div>
          </motion.div>
        </motion.div>

        <motion.div
          className={styles.rightColumn}
          initial={{ opacity: 0, x: 40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: [0.4, 0, 0.2, 1] }}
        >
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              className={`${styles.accordionItem} ${openIndex === index ? styles.accordionItemOpen : ''}`}
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.08 }}
            >
              <button
                className={styles.accordionHeader}
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
              >
                <span className={styles.accordionNumber}>
                  {String(index + 1).padStart(2, '0')}
                </span>
                <span className={styles.accordionQuestion}>{faq.question}</span>
                <div className={`${styles.accordionIcon} ${openIndex === index ? styles.accordionIconOpen : ''}`}>
                  <ChevronDown size={20} />
                </div>
              </button>
              
              <AnimatePresence>
                {openIndex === index && (
                  <motion.div
                    className={styles.accordionContent}
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
                  >
                    <p className={styles.accordionAnswer}>{faq.answer}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default FAQ;
