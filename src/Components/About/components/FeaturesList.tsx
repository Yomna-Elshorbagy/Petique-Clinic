import { useTranslation } from 'react-i18next';
import { FaPaw } from 'react-icons/fa';

export default function FeaturesList() {
    const { t } = useTranslation();

    const features = [
        t("about.features.nutrition"),
        t("about.features.mental"),
        t("about.features.exercise"),
        t("about.features.preventive"),
        t("about.features.grooming"),
        t("about.features.specialNeeds"),
    ];

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
            {features.map((feature, index) => (
                <div key={index} className="flex items-center gap-2 group">
                    <FaPaw className="text-(--color-light-dark) group-hover:text-(--color-light-accent)" />
                    <span className="text-(--color-light-textSecondary) text-sm font-['Playfair_Display']">
                        {feature}
                    </span>
                </div>
            ))}
        </div>
    );
}
