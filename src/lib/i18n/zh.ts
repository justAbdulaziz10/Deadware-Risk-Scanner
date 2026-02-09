import { Translations } from './types';

const zh: Translations = {
  // Navbar
  nav_scanner: '扫描器',
  nav_features: '功能',
  nav_pricing: '价格',
  nav_faq: '常见问题',
  nav_login: '登录',
  nav_signup: '注册',

  // Hero
  hero_badge: '免费开源依赖扫描器',
  hero_title_1: '即时检测废弃和存在漏洞的',
  hero_title_2: '依赖项',
  hero_subtitle: '扫描您的依赖文件以发现 CVE 漏洞、无人维护的包和供应链风险。获取风险评分、总线因子分析和替代建议。100% 在浏览器中运行。',
  hero_cta: '免费扫描您的依赖项',
  hero_github: '在 GitHub 上 Star',
  hero_trust_client: '100% 客户端运行',
  hero_trust_nodata: '无数据上传',
  hero_trust_cve: 'CVE & OSV 扫描',
  hero_trust_ecosystems: '支持 5 个生态系统',
  hero_trust_nosignup: '无需注册',

  // How it works
  how_title_1: '如何扫描依赖项以发现',
  how_title_2: '安全风险',
  how_subtitle: '无需注册。数据不离开浏览器。粘贴、上传或连接 GitHub，几秒内完成扫描。',
  how_step1_title: '添加您的依赖项',
  how_step1_desc: '粘贴您的 package.json，上传文件，输入 GitHub 仓库 URL，或连接您的 GitHub 账户选择任意仓库。',
  how_step2_title: '自动 CVE 和风险分析',
  how_step2_desc: '我们对每个包进行 OSV 漏洞数据库检查、注册表时效性、弃用状态、总线因子和其他 5 项风险指标分析。',
  how_step3_title: '可操作的风险报告',
  how_step3_desc: '获取包含风险评分、CVE 详情和严重性等级的优先级仪表板，以及每个高风险包的精选替代建议。',

  // Ecosystem
  eco_title_1: '跨',
  eco_title_2: '5 个生态系统扫描依赖项',
  eco_subtitle: '一个工具适用于所有依赖文件。只需粘贴或上传，我们将自动检测生态系统。',

  // Features
  feat_title_1: '最全面的',
  feat_title_2: '依赖风险扫描器',
  feat_subtitle: '超越 CVE 扫描。在废弃的包、单一维护者风险和已弃用的库危害您的软件供应链之前检测它们。',

  // Pricing
  pricing_badge: '比企业工具节省 97%',
  pricing_title_1: '企业级安全，',
  pricing_title_2: '独立开发者价格',
  pricing_subtitle: '企业支付 $400/月的漏洞和废弃扫描服务，现在起步价仅为',
  pricing_free: '免费版',
  pricing_free_price: '$0',
  pricing_no_cc: '无需信用卡',
  pricing_pro: '专业版',
  pricing_per_month: '/月',
  pricing_team: '团队版',
  pricing_most_popular: '最受欢迎',
  pricing_cancel: '随时取消，无限制。',
  pricing_start_free: '免费开始',
  pricing_upgrade_pro: '升级至专业版',
  pricing_upgrade_team: '升级至团队版',
  pricing_trust_text: '受到开发者信赖，扫描依赖项覆盖',

  // CTA
  cta_title: '不再为废弃依赖项冒险',
  cta_subtitle: '加入扫描依赖项漏洞、废弃包和供应链风险的开发者行列。免费，零配置。',
  cta_button: '免费开始扫描，无需注册',
  cta_built_by: '构建和维护者',
  cta_support: '支持此项目：请我喝杯咖啡',

  // Scanner
  scan_title: '依赖扫描器',
  scan_subtitle: '扫描您的依赖项以发现废弃和高风险的包',
  scan_paste: '粘贴',
  scan_upload: '上传文件',
  scan_repo_url: '仓库 URL',
  scan_my_repos: '我的仓库',
  scan_button: '扫描依赖项',
  scan_scanning: '扫描中...',
  scan_fetching: '获取依赖项中...',
  scan_template_label: '快速扫描模板：',
  scan_dep_label: '依赖文件内容',
  scan_load_sample: '加载示例 package.json',
  scan_search: '按名称搜索包...',
  scan_filter: '筛选：',
  scan_all: '全部',
  scan_no_match: '没有包匹配此筛选条件。',

  // Export
  export_title: '导出、分享和集成',
  export_share: '分享结果',
  export_copied: '已复制！',
  export_unlock: '解锁所有导出、SBOM 和 CI 集成',
  export_upgrade: '升级',

  // Footer
  footer_desc: '免费开源依赖扫描器，检测废弃的 npm、PyPI 和 RubyGems 包。CVE 漏洞扫描、总线因子分析、弃用警告和替代建议。100% 在浏览器中运行。',
  footer_product: '产品',
  footer_support: '支持',
  footer_source: '源代码',
  footer_report_bug: '报告错误',
  footer_coffee: '请我喝杯咖啡',
  footer_made_with: '用',

  // Common
  common_upgrade_pro: '升级至专业版',
  common_free_scans: '次免费扫描',
};

export default zh;
