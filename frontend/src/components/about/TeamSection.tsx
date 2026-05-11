import { SectionHeading } from '../home/SectionHeading'

const team = [
  {
    name: 'Triều Nguyễn',
    role: 'Frontend Developer',
    description: 'Chịu trách nhiệm thiết kế giao diện người dùng, tối ưu hóa UX và xây dựng hệ thống component linh hoạt.',
    image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix',
  },
  {
    name: 'Jacob Pham',
    role: 'Backend Developer',
    description: 'Xây dựng hệ thống API mạnh mẽ, quản lý cơ sở dữ liệu và đảm bảo tính bảo mật cho toàn bộ ứng dụng.',
    image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Aneka',
  },
]

export function TeamSection() {
  return (
    <section className="bg-shop-blue/40 py-16 sm:py-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          title="Đội ngũ phát triển"
          description="Làm quen với những người đứng sau KidoZone."
        />
        <div className="mt-12 flex flex-col items-center justify-center gap-8 sm:flex-row sm:gap-12">
          {team.map((member) => (
            <div key={member.name} className="group relative w-full max-w-sm">
              <div className="relative overflow-hidden rounded-3xl bg-white p-8 shadow-shop-soft transition-all group-hover:shadow-xl">
                <div className="mx-auto h-32 w-32 overflow-hidden rounded-2xl bg-kid-mint-soft">
                  <img src={member.image} alt={member.name} className="h-full w-full object-cover" />
                </div>
                <div className="mt-6 text-center">
                  <h4 className="text-xl font-bold text-kid-ink">{member.name}</h4>
                  <p className="mt-1 text-sm font-semibold text-kid-green uppercase tracking-wider">
                    {member.role}
                  </p>
                  <p className="mt-4 text-sm leading-relaxed text-kid-ink/70">
                    {member.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
