import { FaPaw } from 'react-icons/fa';

export default function FeaturesList() {
    const features = [
        "Nutrition and Diet",
        "Mental & Emotional Well-Being",
        "Exercise and Physical Activity",
        "Preventive Health",
        "Grooming and Hygiene",
        "Special Needs Pets",
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
