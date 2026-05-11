import { SectionHeading } from '../home/SectionHeading'

const stack = [
  {
    category: 'Frontend',
    items: [
      { name: 'React', icon: 'react', color: '#61DAFB' },
      { name: 'TypeScript', icon: 'typescript', color: '#3178C6' },
      { name: 'Tailwind CSS', icon: 'tailwindcss', color: '#06B6D4' },
      { name: 'Redux', icon: 'redux', color: '#764ABC' },
      { name: 'Vite', icon: 'vite', color: '#646CFF' },
    ],
  },
  {
    category: 'Backend',
    items: [
      { name: 'Node.js', icon: 'nodedotjs', color: '#5FA04E' },
      { name: 'Express', icon: 'express', color: '#000000' },
      { name: 'Prisma', icon: 'prisma', color: '#2D3748' },
      { name: 'PostgreSQL', icon: 'postgresql', color: '#4169E1' },
      { name: 'Zod', icon: 'zod', color: '#3068B7' },
    ],
  },
  {
    category: 'Tools & Deploy',
    items: [
      { name: 'Git', icon: 'git', color: '#F05032' },
      { name: 'Postman', icon: 'postman', color: '#FF6C37' },
      { name: 'Vercel', icon: 'vercel', color: '#000000' },
      { name: 'Render', icon: 'render', color: '#46E3B7' },
      { name: 'ESLint', icon: 'eslint', color: '#4B32C3' },
    ],
  },
]

export function TechStackSection() {
  return (
    <section className="bg-shop-blue/20 py-20 sm:py-32">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          title="Công nghệ sử dụng"
          description="Hệ sinh thái công nghệ hiện đại giúp KidoZone vận hành ổn định và mượt mà."
        />

        <div className="mt-16 space-y-16">
          {stack.map((group) => (
            <div key={group.category}>
              <div className="mb-8 flex items-center gap-4">
                <h3 className="text-lg font-bold text-kid-ink">{group.category}</h3>
                <div className="h-px flex-grow bg-shop-ink/10" />
              </div>

              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
                {group.items.map((item) => (
                  <div
                    key={item.name}
                    className="group relative flex flex-col items-center justify-center rounded-3xl border border-shop-ink/5 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-2 hover:border-shop-teal/20 hover:shadow-xl"
                  >
                    <div className="relative mb-4 flex h-12 w-12 items-center justify-center">
                      {/* Colored circle on hover */}
                      <div
                        className="absolute inset-0 scale-0 rounded-full opacity-10 transition-transform duration-300 group-hover:scale-150"
                        style={{ backgroundColor: item.color }}
                      />
                      <img
                        src={`https://cdn.simpleicons.org/${item.icon}`}
                        alt={item.name}
                        className="h-10 w-10 object-contain grayscale transition-all duration-300 group-hover:grayscale-0"
                      />
                    </div>
                    <span className="text-center text-sm font-bold text-kid-ink/70 transition-colors group-hover:text-kid-ink">
                      {item.name}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}