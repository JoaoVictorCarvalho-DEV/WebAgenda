export function useScrollToItem(selector = '.contact-card') {
    const scrollToItem = (index: number) => {
        const elements = document.querySelectorAll(selector);
        const element = elements[index];
        if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'center' });

            element.classList.add(
                'ring-4',
                'ring-primary',
                'ring-offset-2',
                'ring-offset-background',
                'transition-all'
            )

            setTimeout(() => {
                element.classList.remove(
                    'ring-4',
                    'ring-primary',
                    'ring-offset-2',
                    'ring-offset-background'
                )
            }, 1200)
        }
    };

    return { scrollToItem };
}
