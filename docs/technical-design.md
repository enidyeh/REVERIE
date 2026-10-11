# 技术设计规范

## 技术选型

- Vite + React + TypeScript，作为轻量客户端演示应用。
- 依赖优先使用浏览器和 React 已有能力；引入新依赖前确认必要性并说明用途。
- 首版无后端、无真实 API 和无认证。任何模拟行为都应在界面和代码边界中保持清晰。

## 建议目录

```text
src/
  App.tsx                应用壳、导航和页面编排
  MonthlyThemeView.tsx   当月主题杂志页（DISCOVER）
  ExploreView.tsx        HOME / EXPLORE 栏目
  EventsView.tsx         HOME / EVENTS
  MarketView.tsx         HOME / SHOP（组件名沿用历史命名）
  SpaceView.tsx          HOME / SPACE
  IdentityView.tsx       IDENTITY
  CollaborateView.tsx    COLLABORATE（合作与报名）
  AboutView.tsx          ABOUT（品牌与联系）
  components/            可复用的界面组件
  i18n/                  语言状态与双语文案（messages / context / locale / use-locale / shell）
  data/                  类型化的演示数据与主题内容
  unseen.css             应用壳与全局布局（基础层见 index.css）
  surfaces.css           全站圆角 / 投影 / 触控目标规范（在 main.tsx 最后引入）
  theme.css / explore.css / ...  各页面样式
  main.tsx               应用入口
```

保持实际结构与功能规模匹配。只有当代码量和职责确有需要时才拆分目录或引入路由库，不为未来假设过度抽象。

## 导航与状态

- 顶层导航为五个入口，分左右两组：左侧 `DISCOVER / HOME / IDENTITY`（进入 REVERIE 世界），右侧 `COLLABORATE / ABOUT`（和 REVERIE 发生关系）。桌面端主航栏 `.main-nav` 列出全部五项，右侧在 `COLLABORATE` 之前右对齐插入 `src/components/SocialMarks.tsx`（样式 `src/components/social-marks.css`，`margin-left: auto`，不加竖线，≤1000px 收起）：四个社交渠道标志 + 一条 `role="status"` 演示提示（4 秒后自动收起），地址统一取自 `src/data/social.ts`（ABOUT 的 CONTACT 也引用同一常量）；`COLLABORATE` 与 `ABOUT` 只有单行主标签，`NavItem` 的 `sublabel` 字段与 `.main-nav-label` 样式已随副标签一并删除。移动端（≤760px）底部导航 `.mobile-nav` 只渲染 `DISCOVER / HOME / IDENTITY` 三项，`COLLABORATE` 与 `ABOUT` 改由头部 `MORE ↗` 按钮打开 `src/components/MoreMenu.tsx`（样式 `src/components/more-menu.css`）选择——面板按需挂载，锁定滚动、Esc / 背板 / 关闭按钮均可关闭，关闭后由 `App.tsx` 把焦点交还给 `MORE` 按钮；选中子项后先切栏目再滚到对应区块。
- `src/data/theme.ts` 的 `themeFeatured.items` 同时供 HOME › CONTENT 与 DISCOVER 的「特别推荐」使用；其中 `articles` 直接引用 `src/data/content.ts` 的 `contentTopics`（示范例子），因此两个页面的形式名称与顺序始终一致。依赖方向是 `theme.ts` → `content.ts` 单向（`content.ts` 不引用 `theme.ts`），新增引用时不要反向，以免循环。
- 购票流程是弹层组件 `src/components/BookingFlow.tsx`（样式 `src/components/booking-flow.css`），只在点开屏 `BOOK TICKETS` 时挂载：挂载时把焦点移入浮层并锁定页面滚动，关闭（按钮 / Esc / 背板）后把焦点交还触发按钮；组件内部只持有“当前步骤”与手机号，卸载即丢弃。
- 顶部两行 `.app-header` 与 `.main-nav` 在滚动时保持粘顶（`position: sticky`，`top: 0` / `top: var(--app-header-h)`），高度与 `--app-top-h` 写在 `unseen.css` 的 `:root`（≤760px 主导航行隐藏，`--app-nav-h` 为 `0px`）；DISCOVER 的 `.theme-tabs` 与 HOME 的 `.home-tabs` 都粘在 `top: var(--app-top-h)`，各自向外补出外壳内边距并带不透明背景。DISCOVER 的滚动落点与高亮判定（`MonthlyThemeView.tsx` 的 `topBarHeight()`）按实际测量高度计算，不写死数字。
- EXPLORE 页的四处栏目引导与计划卡片在 `src/ExploreView.tsx`（样式 `src/explore.css` 与 `src/explore-guide.css`），映射规则集中在纯函数模块 `src/data/explore-guides.ts`：只对 `src/data/content.ts`（前 8 条专题）、`src/data/market.ts`（本期选品）、`src/data/spaces.ts` 与 `src/data/discover.ts`（体验）做挑选与排序，不新增文案、不发请求。偏好选项文案也放在这里（`preferenceOptions`），筛选控件 `PreferenceControls` 与提示行 `activePreferenceLabels` 共用；`matchingExperiences` 从组件里移到该模块，推荐列表与计划卡片共用同一套规则；`planFor()` 按当前筛选从体验 / 空间里挑一条拼出计划（标题 / 说明 / 信息行均取自条目字段）。入口由 `App.tsx` 传入 `onOpenContent` / `onOpenShop` / `onOpenSpace` / `onOpenEvents` 切到对应的 HOME 栏目。
  - 命名：2026-10-09 已把组件与样式前缀从 `discover-` 改为 `explore-`（`DiscoverView.tsx` → `ExploreView.tsx`、`discover.css` → `explore.css`）；数据模块仍叫 `src/data/discover.ts`，`localStorage` 键仍为 `unseen:discover:v1` 与 `unseen:discover-preferences:v1`（改名会丢失已有本地状态，因此保留）。
- `HOME` 内部切换五个同级栏目 `EXPLORE / CONTENT / EVENTS / SHOP / SPACE`。`EXPLORE` 由 `src/ExploreView.tsx` 渲染，其余四栏为 `ContentView / EventsView / MarketView / SpaceView`（`MarketView` 保留历史文件名，界面上已是 `SHOP`）。
- 初始原型可使用 React 状态完成页面切换；当浏览器前进/后退或可链接页面成为真实需求时，再评估路由库。
- 演示数据与交互状态分离。数据集中在 `src/data/`，组件不散落复制业务内容。
- 需要跨刷新保留的状态通过有版本前缀的 localStorage 键保存，并对读取值做解析、类型和异常处理；存储不可用时允许本次会话继续使用内存状态。
- 当前键：`unseen:discover:v1`（EXPLORE 已选计划与三条「问题 → 小实验」的完成勾选 `planDone`；`experimentProgress` 已随小实验区块删除，旧数据读取时忽略）、`unseen:discover-preferences:v1`（共享偏好：兴趣方向 / 可用时长 / 出行方式；单次预算已删除，旧数据里的该字段读取时直接忽略）、`unseen:events:v1`、`unseen:market:v1`、`unseen:space:v1`、`unseen:identity:v1`、`unseen:theme:v1`（结构为 `{ issueId, states }`：`issueId` 是当前活动，`states` 按活动 id 各存一份互动记录——三道测试题的答案与锁定状态、24H 任务状态与当前任务示例序号、已预约的活动 id、梦游者昵称，昵称默认为空；旧版「直接存一份记录」的数据读取时归到第一个活动名下）、`unseen:location:v1`（顶部选择的国家城市，仅存城市 id）、`unseen:tickets:v1`（票据，仅存票号 / 对应活动）。主题页的滚动高亮板块、名录入口、当前轮播、活动表日期与购票步骤都只是界面状态，不写入存储（刷新后回到默认）。手机号字段有意不进入该键：它只存在 `BookingFlow` 组件内存中，关闭弹层或刷新即清空。
- 关于主题页中真实场馆、品牌与价格：这些内容由项目方提供，仅作编辑推荐展示，界面上必须同时标明演示属性与“价格以官方渠道为准”，并且不实现购票、售卖、预约或报名。外部链接使用 `target="_blank"` 与 `rel="noreferrer noopener"`。
- localStorage 仅保存演示进度、队伍意向、购物袋、空间预约意向、主题页交互状态和用户主动输入的非敏感文字。不要持久化手机号、认证凭据或秘密。
- 为本地状态提供清晰的重置/恢复演示入口，避免过期数据使验收不可重复。

## 数据和边界

- 为推荐、活动、小队、商品、空间、实验、徽章和体验记录定义明确 TypeScript 类型。
- 演示内容标记为虚构；文案不得伪装成真实交易或真实预约结果。
- “AI 建议”使用确定性的预设模板或规则数据，不发送用户输入到外部服务。
- 将模拟交易和预约封装为本地交互；不实现支付、库存扣减、票务或网络请求。
- 购票演示的票种、价格与限购集中在 `src/data/theme.ts` 的 `themeTicket`（`梦游入场券`、`¥29.9 / 张`、1–10 张、演示说明），组件不硬编码价格；票数不写入存储，关闭弹层即回到默认 1 张。
- 票据跨页面共享：`src/tickets.ts` 统一管理 `TicketRecord`（`id` / `index` / `activityId`）与本地存储键 `unseen:tickets:v1`，DISCOVER 的 `BookingFlow` 在付款那一刻写入，IDENTITY 的 `TicketVault`（`src/components/TicketVault.tsx`）读取并支持取消票据。票与活动的对应关系由 `buildTickets()` 按 `allThemeActivities`（所有活动的活动条目按 id 去重）顺序分配，不随机。票据不包含昵称、手机号或支付信息；入场时间与场地以当前活动的 `entryDate` / `venue` 为唯一来源（由 `MonthlyThemeView` 通过 props 传进 `BookingFlow`），避免多处硬编码。下载票据图片由 `src/ticket-image.ts` 用 canvas 在本地生成，不发网络请求。
- 「下载票据图片」由 `src/ticket-image.ts` 用 canvas 本地绘制（无第三方依赖、不发请求），返回是否真的生成成功，由调用方给出提示；下载图本身标注「演示票 · 不可入场」。二维码在正式方案确定前只呈现占位图形，不生成可扫描码。
- 避免 `any`、不必要的全局状态库和过早的服务层。

## 国际化（中英双版本）

- 语言状态：`Locale = 'zh' | 'en'`，保存在 `localStorage` 的 `unseen:locale:v1`，由 `src/i18n/locale.tsx` 的 `LocaleProvider` 写入并同步 `<html lang>`；组件通过 `src/i18n/use-locale.ts` 的 `useLocale()` 取 `{ locale, setLocale, t }`。
- 取值方式：双语文案写成 `{ zh, en }`（`Localized<T>`，值可以是字符串，也可以是带参数的函数，例如 `{ zh: (n) => `${n} 张票`, en: (n) => `${n} ${plural(n, 'ticket', 'tickets')}` }`）。视图用 `t(value)` 取当前语言；**不使用「中文段落下跟英文段落」的写法**。中文版页面内的眉题与子标签一律中文（纯英文眉题写成 `zh: null`，渲染时跳过），只有品牌标识与主导航保留英文；英文版不出现中文。
- 数据层：数据模块（`src/data/*.ts`）的显示字段就地改写成 `{ zh, en }`，用 `useLocalized(数据模块)`（内部调 `localizeDeep`）在渲染前按当前语言解析一次，得到单语数据树；id、序号、展位号、价格、外链等标识保持普通字符串。视图里的字面量统一収到 `src/i18n/*.ts` 文案模块，不在 JSX 里写双语字面。
- 多活动（主题）：`src/data/theme.ts` 把一份活动内容打包为 `ThemePack`（meta、购票信息、双面与标签、排期、名录、测试与任务等），`themePacks` 列出全部活动（按时间线：游园惊梦 → 梦游仙境），`allThemeActivities` 是按 id 去重的活动条目，`themePackOfActivity()` 按活动条目找回所属活动。DISCOVER 只读当前活动那一份，并用 `useLocalized(pack)` 解析；新增活动只需再添一份 pack（内容可放单独的 `src/data/theme-*.ts`），不改视图。可选的 `dualityLabels` 提供双面那一行的两个标签（着装建议 / 内容、现场布景）；`quiz` / `results` / `challenge` 为可选，`interact: false` 的活动不渲染互动与 24H 任务两个板块，板块导航也随之只剩两项。「游园惊梦」的内容在 `src/data/theme-garden.ts`（资料来自项目方 VOL.2 合作手册与摊主手册）。
- 文件划分：`messages.ts`（类型与常量）、`context.ts`（Context）、`locale.tsx`（只导出 Provider）、`use-locale.ts`（只导出 hook）、`use-localized.ts`（解析 hook）、`localize.ts`（`pick` / `localizeDeep`）、`format.ts`（单复数等格式化）、`meta.ts`（页面 meta 按语言重写）；文案：`shell.ts`（外壳）、`home.ts`（HOME 英雄区与五个子栏目标签）、`discover.ts`（DISCOVER、购票弹层与活动切换）、`explore.ts`（EXPLORE 与偏好选项）、`content.ts`（CONTENT）、`events.ts`（EVENTS）、`identity.ts`（IDENTITY）、`market.ts`（SHOP）、`space.ts`（SPACE）、`tickets.ts`（票据图片 canvas 与票夹）、`collaborate.ts`（COLLABORATE）、`about.ts`（ABOUT）——拆分是为了满足 `react-refresh/only-export-components`。
- 入口控件：`src/components/LanguagePicker.tsx`（样式 `language-picker.css`）放在页头 `.header-selects` 内、国家城市选择器右侧，交互与 `LocationPicker` 一致（弹层 + Esc / 背板关闭 + 焦点交还）。窄屏（≤760px）时两个选择器只显示图标，保留 44px 触控尺寸与 `aria-label`。
- 静态 meta：`index.html` 保留中文（爬虫读到的是中文），浏览器内切换语言时由 `LocaleProvider` 调 `meta.ts` 的 `applySiteMeta` 重写 `description` / `og:description` / `twitter:description` / `og:locale`；标题与 `og:title` 用品牌标语，两版一致。
- 进度与术语：见 `docs/i18n-glossary.md`（含规则、术语表与逐页状态）。已完成：外壳 + DISCOVER（含活动切换）+ HOME 五个栏目 + IDENTITY（含票据夹）+ COLLABORATE + ABOUT，即全站已双语。
- 本地档案的语言边界：示例档案双语（`DemoArchiveEntry`，渲染前用 `useLocalized` 解析）；用户写入的档案存单语字符串（`ArchiveEntry`），写入时按当前语言生成默认地点与分类，**之后切换语言不再翻译用户内容**。预设反思（`createReflection`）按语言判断：中文按关键词 + 100 字，英文按关键词 + 40 词。
- 依赖中文文字的排序已清理：EXPLORE 的专题排序（`topicAffinity`）改用专题 id 匹配（`contentTopics.items` 带 `id`），不再因翻译失效。
- 自动化防线：`src/i18n/i18n.test.ts` 遍历数据与文案模块，断言每个 `{ zh, en }` 每侧要么有内容要么明确为 `null`（不得是空字符串、不得两侧都空），且**英文侧不出现任何中文**；`localizeDeep` 有单独用例。

## 质量要求

- 类型检查和生产构建必须通过后才能结束阶段。
- 全量检查脚本为 `npm run check`（= `lint` + `test` + `build`）；单测为 `npm test`（Vitest，目前覆盖筛选规则、计划挑选、商店分类与票据编号共 15 条断言），CI 配置在 `.github/workflows/ci.yml`。
- 仓库已初始化为 git（2026-10-09），提交前先跑 `npm run check`；删除内容前先确认 git 历史里可回溯。
- 构建已分包：`react-vendor`（React 运行时）、`icons`（lucide-react）与业务代码分开，便于缓存。
- 交互组件要有明确空状态、成功反馈和可重复演示的状态恢复方式。
- 状态更新应保持一致；同一动作不能造成重复加入或重复确认。
- 样式与业务逻辑分离，颜色和尺寸优先使用统一 CSS 自定义属性。颜色令牌集中在 `src/index.css` 的 `:root`（`--ink` / `--paper` / `--muted` / `--rule` / `--pink` / `--violet` / `--on-acid` / `--panel` / `--shade`）；视觉参考为项目方提供的《第一版 NEURO GROWTH.pdf》（深蓝底 + 酸黄 + 紫）。令牌名沿用历史命名，`--paper` 现为酸黄主文字色、`--pink` 现为紫色强调色。
- 国家与城市选择器（`src/components/LocationPicker.tsx`）为界面偏好，不改变任何页面内容；数据在 `src/data/locations.ts`。需要在滚动列表里支持搜索、Esc 关闭并把焦点还给触发按钮、打开时聚焦搜索框。