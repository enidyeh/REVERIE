# 中英双语方案与术语表

2026-10-09 起，站点要做成**中文 / English 两个独立版本**。

## 规则（项目方已确认）

1. **两个独立版本，不混排**：不采用「每段中文下面跟一段英文」的写法；同一页只出现一种语言的正文。
2. **英文版不出现任何中文**（专有名词除外：`REVERIE`、`UNSEEN BOX`、`REVERIE SHOP`、`REALMVIEW`、`SHANGHAI` 等）。
3. **中文版页面内的眉题与子标签一律中文**（2026-10-09 修订，取代此前「中文版保留英文眉题混排」的说法）：纯英文眉题（`FEATURED` / `WHAT'S INSIDE` / `EVENT SCHEDULE` / `DIRECTORY` / `DREAM ARCHETYPE` 等）删除或改写为中文，双语标签只留中文（`入梦日期` / `入梦坐标` / `着装建议` / `现场布景风格` / `梦境原型`）。**保留英文的只有品牌与体系标识**：主导航 `DISCOVER / HOME / IDENTITY / COLLABORATE / ABOUT`、字标 `REVERIE®` / `UNSEEN®`、`UNSEEN® / CITY PASSPORT`、页脚 `AS WE WANDER, WE BECOME.` / `UNSEEN® / SHANGHAI`，以及展位号、票号、`ISSUE 002` 这类编号与 `Cos` / `Lolita` / `BJD` / `Instagram` 这类品类专名。
4. **切换入口**：页头中间、国家城市选择器右侧的语言图标（🌐 + 当前语言），点开为小面板选择 `中文 / English`；选择立即生效并保存在本机（`unseen:locale:v1`），`<html lang>` 同步为 `zh-CN` / `en`，页面 meta 同步按语言重写（静态 HTML 保留中文）。
5. 内容按页面逐个确认后落地，未确认的页面在英文版下仍显示中文（阶段性状态，见文末进度表）。

## 技术实现

- `src/i18n/messages.ts`：`Locale` / `Localized<T>`（值可以是字符串或函数）、`locales` 选项、`localeStorageKey`、`loadLocale()`。
- `src/i18n/context.ts`：`LocaleContext`。
- `src/i18n/locale.tsx`：`LocaleProvider`（写入 localStorage、同步 `<html lang>` 与页面 meta）。
- `src/i18n/use-locale.ts`：`useLocale()`，返回 `{ locale, setLocale, t }`；`t({ zh, en })` 取当前语言，值可以是函数：`t({ zh: (n) => `${n} 张票`, en: (n) => … })(2)`。
- `src/i18n/localize.ts`：`pick(locale, value)` 与 `localizeDeep(value, locale)`；`use-localized.ts` 的 `useLocalized(数据模块)` 在渲染前把数据里的 `{ zh, en }` 叶子解析成单语树（数据模块保持单一数据源）。
- `src/i18n/format.ts`：`plural(count, one, many)` 等量词工具（中文无复数变化，英文按单复数取词）。
- `src/i18n/meta.ts`：页面级 meta 文案与 `applySiteMeta`。
- 文案模块：`shell.ts`（外壳）、`discover.ts`（DISCOVER 页与购票弹层）、`tickets.ts`（票据图片 canvas）。
- 自动化防线：`src/i18n/i18n.test.ts` 断言每个 `{ zh, en }` 每侧要么有内容要么明确为 `null`、且**英文侧不出现任何中文**。

## 术语表（待项目方逐条确认）

> 表格里的英文是建议稿；`待定` 表示需要项目方给一个说法。确认后即为全站统一用法。

### 品牌与体系

| 中文 | 建议英文 | 备注 |
| --- | --- | --- |
| 异想集 | REVERIE | 已确认过的英文名，保留 |
| 暗盒 | UNSEEN BOX | 同上 |
| 异想商店 | REVERIE SHOP | 同上 |
| 域见 | REALMVIEW | 同上 |
| 梦游仙境（本期主题） | WONDERLAND | 现数据里是 `REVERIE ｜in the WONDERLAND`，英文版建议只留 `WONDERLAND` 或 `REVERIE in the WONDERLAND`，**待定** |
| 异想集 REVERIE｜IN THE WONDERLAND（系列名） | REVERIE｜IN THE WONDERLAND | 本身已是英文 |
| 异想集（活动/策展/社群） | Experience | ABOUT 里的四分工之一 |
| 暗盒（内容/观察/推荐） | Content | 同上 |
| 异想商店（选品/原创/联名） | Commerce | 同上 |
| 域见（品牌/营销/商业服务） | Services | 同上 |

### 导航与外壳

| 中文 | 建议英文 | 备注 |
| --- | --- | --- |
| DISCOVER / HOME / IDENTITY | 同左 | 已英文 |
| COLLABORATE / ABOUT | 同左 | 已英文 |
| EXPLORE / CONTENT / EVENTS / SHOP / SPACE | 同左 | 已英文 |
| 更多（MORE 菜单） | MORE | MORE 菜单外壳已双语 |
| 选择语言 / 当前语言 | Choose language / Current language | 已双语 |
| 选择国家地区 / 你要从哪里开始？ | SELECT REGION / Where are you? | 已双语 |
| 中文 / English | 同左 | 语言名保留各自写法 |
| 回到页首 | Back to top | |

### 通用操作

| 中文 | 建议英文 |
| --- | --- |
| 查看详情 / 看作品 / 查看更多 | View details / See the piece / See more |
| 加入购物袋 / 加入购物车 | Add to bag / Add to cart |
| 加入小队 / 退出小队 | Join the squad / Leave the squad |
| 预约参观意向 / 预约时段 | Visit intent / Reserve a time slot |
| 清除筛选 / 清除偏好 | Clear filters / Clear preferences |
| 去发布 / 完成方式 | Publish / How to finish |
| 下载票据图片 | Download ticket image |
| 取消票据 / 联系客服 | Cancel ticket / Contact support |
| 模拟下单 / 继续逛集市 | Place demo order / Keep browsing |
| 回到集市 | Back to the shop |

### 筛选与分类

| 中文 | 建议英文 |
| --- | --- |
| 兴趣方向 / 可用时长 / 出行方式 | Interest / Time available / Company |
| 都可以 / 暂不限定 | Any |
| 城市漫游 / 动手创作 / 聆听时刻 | City wander / Hands-on / Listening |
| 适合独自出发 / 想认识同行者 | Going solo / Meeting people |
| 独立创作者产品 / 艺术家周边 / 海外小众商品 / 自有原创产品 | Independent creators / Artist merch / Niche imports / REVERIE originals |
| 活动上的品牌 / UNSEEN 发现的品牌（历史分类） | Event brands / UNSEEN finds |
| 全部 | All |

### 演示标注（重要：英文版必须同样标清演示属性）

| 中文 | 建议英文 |
| --- | --- |
| 演示 / 演示数据 | Demo / Demo data |
| 虚构演示内容 | Fictional demo content |
| 待项目方提供 | To be provided |
| 占位 / 占位素材 | Placeholder |
| 不接入真实支付 | No real payment is involved |
| 仅本地保存 | Stored on this device only |
| 小队 / 同行者 | Squad / Companions（**待定**：也可用 crew / teammates） |
| 活动 / 现场 | Event / On site |
| 空间 / 到访意向 | Space / Visit intent |
| 票据 / 票夹 / 票号 | Ticket / Ticket wallet / Ticket number |

## 逐页确认进度

| 范围 | 状态 | 说明 |
| --- | --- | --- |
| 外壳（页头 / 主导航 / 手机底栏 / MORE 菜单 / 国家城市选择器 / 语言选择器 / 社交标志 / 页面 meta） | ✅ 已双语并验证 | E51–E52 |
| DISCOVER（月度主题页 + 购票弹层 + 票据图片 canvas） | ✅ 已双语并验证 | E52：英文版整页 0 个中文字符 |
| HOME 英雄区（「在现场，遇见更多。」） | ⬜ 待确认 | App.tsx 内联 |
| HOME › EXPLORE | ⬜ 待确认 | 偏好筛选、三条计划、四处栏目引导 |
| HOME › CONTENT | ⬜ 待确认 | 已临时接入 `t()` 以保持编译，文案未双语化 |
| HOME › EVENTS | ⬜ 待确认 | 定位说明、形式标签、四个活动、小队 |
| HOME › SHOP | ⬜ 待确认 | 说明、八个商品、购物袋与下单流程 |
| HOME › SPACE | ⬜ 待确认 | 三个空间、预约流程 |
| IDENTITY | ⬜ 待确认 | 护照、徽章、记录表单、票据夹（已临时接入 `pick()`） |
| COLLABORATE | ⬜ 待确认 | 定位、招募、身份选择、报名表单 |
| ABOUT | ⬜ 待确认 | 一句话定义、四个品牌、数据、联系方式 |
