// Dữ liệu mẫu để phát triển giao diện — nội dung hư cấu, không phải tin thật.

export const categories: {
  name: string
  slug: string
  order: number
  description?: string
  parent?: string
}[] = [
  { name: 'Thời sự', slug: 'thoi-su', order: 1, description: 'Tin tức thời sự trong nước.' },
  { name: 'Thế giới', slug: 'the-gioi', order: 2, description: 'Tin tức quốc tế.' },
  { name: 'Kinh tế', slug: 'kinh-te', order: 3, description: 'Thị trường, doanh nghiệp, tài chính.' },
  { name: 'Giáo dục', slug: 'giao-duc', order: 4, description: 'Tuyển sinh, du học, chuyện trường lớp.' },
  { name: 'Thể thao', slug: 'the-thao', order: 5, description: 'Bóng đá, tennis và các môn thể thao khác.' },
  { name: 'Giải trí', slug: 'giai-tri', order: 6, description: 'Phim ảnh, âm nhạc, sao Việt.' },
  { name: 'Công nghệ', slug: 'cong-nghe', order: 7, description: 'Sản phẩm số, AI, khởi nghiệp công nghệ.' },
  { name: 'Pháp luật', slug: 'phap-luat', order: 1, parent: 'thoi-su' },
  { name: 'Bóng đá', slug: 'bong-da', order: 1, parent: 'the-thao' },
]

export const tags = ['Hà Nội', 'TP.HCM', 'Giao thông', 'Chứng khoán', 'Tuyển sinh', 'AI', 'Đội tuyển Việt Nam', 'Điện ảnh']

const body = (topic: string): string[] => [
  `Đây là nội dung mẫu cho bài viết về ${topic}, được tạo tự động bởi script seed để phục vụ việc phát triển giao diện Newsora.`,
  'Theo ghi nhận của phóng viên, nhiều ý kiến cho rằng vấn đề cần được nhìn nhận một cách toàn diện, từ góc độ chính sách cho tới thực tiễn triển khai tại địa phương.',
  '## Những điểm đáng chú ý',
  'Các chuyên gia nhận định trong thời gian tới, việc phối hợp giữa các bên liên quan sẽ đóng vai trò quyết định. Người dân cũng kỳ vọng sẽ sớm có những thay đổi tích cực, thiết thực.',
  'Bên cạnh đó, một số khó khăn vẫn còn tồn tại như nguồn lực hạn chế, quy trình thủ tục còn phức tạp. Đây là những vấn đề cần được tháo gỡ trong giai đoạn tiếp theo.',
  '## Hướng đi sắp tới',
  'Ban biên tập sẽ tiếp tục cập nhật diễn biến mới nhất. Bạn đọc có thể gửi ý kiến, thông tin về tòa soạn qua email hoặc đường dây nóng.',
]

export const posts: {
  title: string
  slug: string
  sapo: string
  category: string
  tags: string[]
  content: string[]
  featured?: boolean
}[] = [
  {
    title: 'Hà Nội thí điểm phân luồng giao thông mới tại các nút giao trọng điểm',
    slug: 'ha-noi-thi-diem-phan-luong-giao-thong-moi',
    sapo: 'Từ tuần tới, nhiều nút giao trong nội thành sẽ được điều chỉnh phương án phân luồng nhằm giảm ùn tắc giờ cao điểm.',
    category: 'thoi-su',
    tags: ['Hà Nội', 'Giao thông'],
    content: body('phân luồng giao thông tại Hà Nội'),
    featured: true,
  },
  {
    title: 'TP.HCM đẩy nhanh tiến độ các dự án chống ngập',
    slug: 'tphcm-day-nhanh-tien-do-du-an-chong-ngap',
    sapo: 'Nhiều công trình chống ngập được yêu cầu hoàn thành trước mùa mưa năm sau.',
    category: 'thoi-su',
    tags: ['TP.HCM'],
    content: body('các dự án chống ngập ở TP.HCM'),
  },
  {
    title: 'Xét xử vụ án lừa đảo qua mạng với hàng trăm bị hại',
    slug: 'xet-xu-vu-an-lua-dao-qua-mang',
    sapo: 'Phiên tòa dự kiến kéo dài một tuần, với sự tham gia của nhiều luật sư bào chữa.',
    category: 'phap-luat',
    tags: [],
    content: body('vụ án lừa đảo qua mạng'),
  },
  {
    title: 'Hội nghị thượng đỉnh khí hậu đạt thỏa thuận về quỹ hỗ trợ',
    slug: 'hoi-nghi-thuong-dinh-khi-hau-dat-thoa-thuan',
    sapo: 'Các quốc gia thống nhất lộ trình đóng góp cho quỹ hỗ trợ các nước đang phát triển ứng phó biến đổi khí hậu.',
    category: 'the-gioi',
    tags: [],
    content: body('hội nghị thượng đỉnh khí hậu'),
    featured: true,
  },
  {
    title: 'Châu Âu siết quy định với các nền tảng mạng xã hội',
    slug: 'chau-au-siet-quy-dinh-nen-tang-mang-xa-hoi',
    sapo: 'Bộ quy tắc mới yêu cầu các nền tảng minh bạch hơn về thuật toán đề xuất nội dung.',
    category: 'the-gioi',
    tags: [],
    content: body('quy định mới với mạng xã hội tại châu Âu'),
  },
  {
    title: 'Chứng khoán khởi sắc, thanh khoản tăng mạnh cuối phiên',
    slug: 'chung-khoan-khoi-sac-thanh-khoan-tang-manh',
    sapo: 'Dòng tiền quay trở lại nhóm cổ phiếu ngân hàng và bất động sản giúp chỉ số tăng điểm.',
    category: 'kinh-te',
    tags: ['Chứng khoán'],
    content: body('diễn biến thị trường chứng khoán'),
    featured: true,
  },
  {
    title: 'Doanh nghiệp xuất khẩu tìm cách thích ứng với thị trường mới',
    slug: 'doanh-nghiep-xuat-khau-thich-ung-thi-truong-moi',
    sapo: 'Đa dạng hóa thị trường đang là chiến lược được nhiều doanh nghiệp lựa chọn.',
    category: 'kinh-te',
    tags: [],
    content: body('doanh nghiệp xuất khẩu'),
  },
  {
    title: 'Công bố phương án tuyển sinh đại học năm tới',
    slug: 'cong-bo-phuong-an-tuyen-sinh-dai-hoc',
    sapo: 'Nhiều trường giữ ổn định phương thức xét tuyển, bổ sung một số tổ hợp mới.',
    category: 'giao-duc',
    tags: ['Tuyển sinh'],
    content: body('phương án tuyển sinh đại học'),
  },
  {
    title: 'Trường học ứng dụng AI hỗ trợ giáo viên chấm bài',
    slug: 'truong-hoc-ung-dung-ai-ho-tro-cham-bai',
    sapo: 'Công cụ mới giúp giáo viên tiết kiệm thời gian nhưng vẫn cần sự kiểm tra của con người.',
    category: 'giao-duc',
    tags: ['AI'],
    content: body('ứng dụng AI trong trường học'),
  },
  {
    title: 'Đội tuyển Việt Nam công bố danh sách tập trung',
    slug: 'doi-tuyen-viet-nam-cong-bo-danh-sach-tap-trung',
    sapo: 'Ban huấn luyện gọi thêm nhiều gương mặt trẻ cho đợt tập trung sắp tới.',
    category: 'bong-da',
    tags: ['Đội tuyển Việt Nam'],
    content: body('danh sách tập trung của đội tuyển'),
    featured: true,
  },
  {
    title: 'Giải chạy marathon thu hút hàng nghìn vận động viên',
    slug: 'giai-chay-marathon-thu-hut-hang-nghin-van-dong-vien',
    sapo: 'Sự kiện năm nay ghi nhận số lượng vận động viên quốc tế tham gia tăng cao.',
    category: 'the-thao',
    tags: ['TP.HCM'],
    content: body('giải chạy marathon'),
  },
  {
    title: 'Phim Việt lập kỷ lục doanh thu phòng vé',
    slug: 'phim-viet-lap-ky-luc-doanh-thu-phong-ve',
    sapo: 'Bộ phim vượt mốc doanh thu sau chưa đầy hai tuần ra rạp.',
    category: 'giai-tri',
    tags: ['Điện ảnh'],
    content: body('thành công phòng vé của phim Việt'),
  },
  {
    title: 'Liên hoan âm nhạc ngoài trời trở lại sau nhiều năm',
    slug: 'lien-hoan-am-nhac-ngoai-troi-tro-lai',
    sapo: 'Chương trình quy tụ nhiều nghệ sĩ trẻ được yêu thích.',
    category: 'giai-tri',
    tags: ['Hà Nội'],
    content: body('liên hoan âm nhạc ngoài trời'),
  },
  {
    title: 'Startup Việt gọi vốn thành công cho nền tảng AI',
    slug: 'startup-viet-goi-von-thanh-cong-nen-tang-ai',
    sapo: 'Khoản đầu tư sẽ được dùng để mở rộng đội ngũ kỹ sư và thị trường khu vực.',
    category: 'cong-nghe',
    tags: ['AI'],
    content: body('startup AI gọi vốn'),
    featured: true,
  },
  {
    title: 'Mẹo bảo vệ tài khoản trực tuyến trước các chiêu lừa đảo',
    slug: 'meo-bao-ve-tai-khoan-truc-tuyen',
    sapo: 'Bật xác thực hai lớp và cảnh giác với đường link lạ là những bước cơ bản nhất.',
    category: 'cong-nghe',
    tags: [],
    content: body('bảo mật tài khoản trực tuyến'),
  },
]
