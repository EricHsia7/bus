var svg_tag_start = `<svg stroke-miterlimit="10" style="fill-rule:nonzero;clip-rule:evenodd;stroke-linecap:round;stroke-linejoin:round;" version="1.1" viewBox="0 0 64 64" xml:space="preserve" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">`;
var svg_tag_end = `</svg>`;

export interface Icon {
  source: 'icons' | 'svg';
  id: string | null;
  content: string | null;
}

function getIconHTML(icon: Icon): string {
  switch (icon.source) {
    case 'icons':
      return icons[icon.id];
      break;
    case 'svg':
      return icon.content;
      break;
    default:
      return icons.none;
      break;
  }
}

export let icons = {
  getIconHTML,
  none: '',
  bus: `${svg_tag_start}<path d="M12.5474 64C11.8175 64 11.1719 63.7895 10.6105 63.3684C10.0491 62.9474 9.76842 62.4 9.76842 61.7263L9.76842 54.6526C8.14035 53.7544 6.94737 52.4632 6.18947 50.7789C5.43158 49.0947 5.05263 47.2982 5.05263 45.3895L5.05263 11.9579C5.05263 7.80351 7.2 4.77193 11.4947 2.86316C15.7895 0.954386 22.6526 0 32.0842 0C41.4035 0 48.2105 0.954386 52.5053 2.86316C56.8 4.77193 58.9474 7.80351 58.9474 11.9579L58.9474 45.3895C58.9474 47.2982 58.5684 49.0947 57.8105 50.7789C57.0526 52.4632 55.8596 53.7544 54.2316 54.6526L54.2316 61.7263C54.2316 62.4 53.9509 62.9474 53.3895 63.3684C52.8281 63.7895 52.1825 64 51.4526 64L49.8526 64C49.0667 64 48.393 63.7895 47.8316 63.3684C47.2702 62.9474 46.9895 62.4 46.9895 61.7263L46.9895 57.0947L17.0105 57.0947L17.0105 61.7263C17.0105 62.4 16.7298 62.9474 16.1684 63.3684C15.607 63.7895 14.9333 64 14.1474 64L12.5474 64ZM10.1053 29.3895L53.8947 29.3895L53.8947 14.8211L10.1053 14.8211L10.1053 29.3895ZM19.0316 47.8316C20.3228 47.8316 21.4175 47.3825 22.3158 46.4842C23.214 45.586 23.6632 44.4912 23.6632 43.2C23.6632 41.9088 23.214 40.814 22.3158 39.9158C21.4175 39.0175 20.3228 38.5684 19.0316 38.5684C17.7404 38.5684 16.6456 39.0175 15.7474 39.9158C14.8491 40.814 14.4 41.9088 14.4 43.2C14.4 44.4912 14.8491 45.586 15.7474 46.4842C16.6456 47.3825 17.7404 47.8316 19.0316 47.8316ZM44.9684 47.8316C46.2596 47.8316 47.3544 47.3825 48.2526 46.4842C49.1509 45.586 49.6 44.4912 49.6 43.2C49.6 41.9088 49.1509 40.814 48.2526 39.9158C47.3544 39.0175 46.2596 38.5684 44.9684 38.5684C43.6772 38.5684 42.5825 39.0175 41.6842 39.9158C40.786 40.814 40.3368 41.9088 40.3368 43.2C40.3368 44.4912 40.786 45.586 41.6842 46.4842C42.5825 47.3825 43.6772 47.8316 44.9684 47.8316Z" fill-rule="nonzero" opacity="1" stroke="none"/>${svg_tag_end}`,
  expand: `${svg_tag_start}<path d="M31.9859 50.0345C31.2639 50.0345 30.5919 49.9193 29.9699 49.6889C29.3478 49.4584 28.7565 49.0629 28.1959 48.5023L1.27359 21.58C0.444118 20.7507 0.0197971 19.7081 0.000627777 18.4524C-0.0186414 17.1968 0.40568 16.135 1.27359 15.2672C2.1414 14.3994 3.19352 13.9655 4.42994 13.9655C5.66636 13.9655 6.71848 14.3994 7.58629 15.2672L31.9859 39.6668L56.3854 15.2672C57.2148 14.4378 58.2573 14.0135 59.513 13.9942C60.7686 13.9751 61.8303 14.3994 62.6981 15.2672C63.566 16.135 64 17.1872 64 18.4237C64 19.6601 63.566 20.7122 62.6981 21.58L35.7758 48.5023C35.2152 49.0629 34.6239 49.4584 34.0018 49.6889C33.3798 49.9193 32.7078 50.0345 31.9859 50.0345Z" fill-rule="nonzero" opacity="1" stroke="none" />${svg_tag_end}`,
  route: `${svg_tag_start}<path d="M21.0285 64C17.2401 64 14.0073 62.6614 11.3301 59.9842C8.65292 57.307 7.31431 54.0742 7.31431 50.2858L7.31431 19.7555C5.18097 18.9631 3.42858 17.696 2.05715 15.9542C0.685716 14.2124 2.13163e-14 12.2507 2.13163e-14 10.0691C2.13163e-14 7.27207 0.977374 4.89464 2.93212 2.93679C4.88687 0.978928 7.26049 0 10.053 0C12.8454 0 15.2204 0.978928 17.1779 2.93679C19.1354 4.89464 20.1142 7.27207 20.1142 10.0691C20.1142 12.2507 19.4284 14.2124 18.057 15.9542C16.6856 17.696 14.9332 18.9631 12.7999 19.7555L12.7999 50.2858C12.7999 52.5486 13.6063 54.4858 15.2191 56.0973C16.8319 57.7087 18.7706 58.5145 21.0354 58.5145C23.3002 58.5145 25.2366 57.7087 26.8449 56.0973C28.4531 54.4858 29.2572 52.5486 29.2572 50.2858L29.2572 13.7142C29.2572 9.92579 30.5958 6.69299 33.2731 4.01583C35.9502 1.33861 39.183 0 42.9715 0C46.7599 0 49.9927 1.33861 52.6699 4.01583C55.3471 6.69299 56.6857 9.92579 56.6857 13.7142L56.6857 44.2445C58.819 45.0369 60.5714 46.304 61.9429 48.0458C63.3143 49.7876 64 51.7493 64 53.9309C64 56.7279 63.0226 59.1054 61.0679 61.0632C59.1131 63.0211 56.7395 64 53.947 64C51.1546 64 48.7796 63.0211 46.8221 61.0632C44.8646 59.1054 43.8858 56.7279 43.8858 53.9309C43.8858 51.7493 44.5716 49.7724 45.943 48C47.3144 46.2278 49.0668 44.9759 51.2001 44.2445L51.2001 13.7142C51.2001 11.4514 50.3937 9.51421 48.7809 7.90274C47.1681 6.29128 45.2294 5.48555 42.9646 5.48555C40.6998 5.48555 38.7634 6.29128 37.1551 7.90274C35.5469 9.51421 34.7428 11.4514 34.7428 13.7142L34.7428 50.2858C34.7428 54.0742 33.4042 57.307 30.7269 59.9842C28.0498 62.6614 24.817 64 21.0285 64ZM10.0571 14.6286C11.3277 14.6286 12.4073 14.1844 13.2959 13.2959C14.1844 12.4073 14.6286 11.3277 14.6286 10.0571C14.6286 8.78646 14.1844 7.70687 13.2959 6.81831C12.4073 5.9298 11.3277 5.48555 10.0571 5.48555C8.78646 5.48555 7.70687 5.9298 6.81831 6.81831C5.9298 7.70687 5.48555 8.78646 5.48555 10.0571C5.48555 11.3277 5.9298 12.4073 6.81831 13.2959C7.70687 14.1844 8.78646 14.6286 10.0571 14.6286ZM53.9429 58.5145C55.2135 58.5145 56.2931 58.0702 57.1817 57.1817C58.0702 56.2931 58.5145 55.2135 58.5145 53.9429C58.5145 52.6723 58.0702 51.5927 57.1817 50.7041C56.2931 49.8156 55.2135 49.3714 53.9429 49.3714C52.6723 49.3714 51.5927 49.8156 50.7041 50.7041C49.8156 51.5927 49.3714 52.6723 49.3714 53.9429C49.3714 55.2135 49.8156 56.2931 50.7041 57.1817C51.5927 58.0702 52.6723 58.5145 53.9429 58.5145Z" fill-rule="nonzero" opacity="1" stroke="none"/>${svg_tag_end}`,
  favorite: `${svg_tag_start}<path d="M16.8437 5.375C12.3586 5.375 8.70708 6.85542 5.71875 9.84375C2.72838 12.8341 1.25 16.4555 1.25 20.9375C1.25 26.5939 3.43756 31.9267 7.96875 37C12.6281 42.2168 17.9301 47.5483 23.875 52.9688C25.0847 54.0683 27.5091 56.2442 28.7187 57.3438C28.7335 57.3572 28.7359 57.3921 28.75 57.4062C29.1763 57.8325 29.6641 58.115 30.2187 58.3125C30.8229 58.5276 31.3988 58.625 31.9687 58.625C32.5388 58.625 33.132 58.5294 33.75 58.3125C34.3161 58.1139 34.7957 57.8293 35.2187 57.4062C35.233 57.392 35.2351 57.3573 35.25 57.3438C36.4467 56.2571 38.8345 54.0866 40.0312 53C45.8707 47.7321 51.1668 42.4653 55.9062 37.1875C60.5184 32.0515 62.75 26.6549 62.75 20.9375C62.75 16.4523 61.2696 12.8321 58.2812 9.84375C55.2909 6.85338 51.6383 5.375 47.1562 5.375C44.6352 5.375 42.1551 5.94379 39.6562 7.125C37.2239 8.2748 34.9926 10.1595 33 12.8437C32.4981 13.5199 31.5019 13.5199 31 12.8437C29.0072 10.1592 26.7761 8.27477 24.3437 7.125C21.8446 5.94367 19.3646 5.375 16.8437 5.375Z" fill-rule="nonzero" opacity="1" stroke="none" filling="filling" /><path d="M31.9676 59.8898C31.2464 59.8898 30.522 59.7603 29.7944 59.5011C29.0667 59.242 28.4264 58.8361 27.8737 58.2834L23.0349 53.885C17.0624 48.4394 11.7301 43.0899 7.03808 37.8364C2.34603 32.5829 0 26.9549 0 20.9522C0 16.1717 1.61188 12.1695 4.83563 8.94579C8.05939 5.72204 12.0615 4.11016 16.8421 4.11016C19.5584 4.11016 22.2412 4.73635 24.8907 5.98873C27.5401 7.24111 29.9098 9.27514 32 12.0908C34.0902 9.27514 36.4599 7.24111 39.1093 5.98873C41.7588 4.73635 44.4416 4.11016 47.1579 4.11016C51.9385 4.11016 55.9406 5.72204 59.1644 8.94579C62.3881 12.1695 64 16.1717 64 20.9522C64 27.0197 61.614 32.7103 56.8421 38.0243C52.0701 43.3382 46.7497 48.6424 40.8809 53.9368L36.0939 58.2834C35.5411 58.8361 34.8955 59.242 34.1571 59.5011C33.4186 59.7603 32.6888 59.8898 31.9676 59.8898ZM29.5773 17.2081C27.755 14.4313 25.8365 12.3962 23.8219 11.1029C21.8073 9.80943 19.4807 9.16272 16.8421 9.16272C13.4736 9.16272 10.6666 10.2855 8.42099 12.5311C6.17537 14.7768 5.05256 17.5838 5.05256 20.9522C5.05256 23.6556 5.92381 26.4821 7.66629 29.4316C9.40878 32.3811 11.5961 35.3133 14.2282 38.2282C16.8603 41.1432 19.7116 43.9913 22.782 46.7724C25.8525 49.5535 28.6984 52.1382 31.3197 54.5264C31.5141 54.6991 31.7409 54.7855 32 54.7855C32.2591 54.7855 32.4859 54.6991 32.6803 54.5264C35.3016 52.1382 38.1475 49.5535 41.218 46.7724C44.2884 43.9913 47.1397 41.1432 49.7718 38.2282C52.4039 35.3133 54.5912 32.3811 56.3337 29.4316C58.0762 26.4821 58.9474 23.6556 58.9474 20.9522C58.9474 17.5838 57.8246 14.7768 55.579 12.5311C53.3334 10.2855 50.5264 9.16272 47.1579 9.16272C44.5193 9.16272 42.1927 9.80943 40.1781 11.1029C38.1635 12.3962 36.245 14.4313 34.4227 17.2081C34.1376 17.64 33.7792 17.9639 33.3474 18.1798C32.9155 18.3958 32.4664 18.5037 32 18.5037C31.5336 18.5037 31.0845 18.3958 30.6526 18.1798C30.2208 17.9639 29.8624 17.64 29.5773 17.2081Z" fill-rule="nonzero" opacity="1" stroke="none"/>${svg_tag_end}`,
  format: `${svg_tag_start}<path d="M40.1297 13.8946L26.9798 13.8946C25.9901 13.8946 25.149 13.5479 24.4562 12.8543C23.7635 12.1609 23.4171 11.3188 23.4171 10.3281C23.4171 9.33746 23.7635 8.49125 24.4562 7.78949C25.149 7.08774 25.9901 6.73686 26.9798 6.73686L60.4373 6.73686C61.4269 6.73686 62.2681 7.08361 62.9608 7.77712C63.6536 8.47062 64 9.3127 64 10.3034C64 11.2941 63.6536 12.1403 62.9608 12.842C62.2681 13.5437 61.4269 13.8946 60.4373 13.8946L47.2874 13.8946L47.2874 53.7004C47.2874 54.6901 46.9406 55.5313 46.2472 56.224C45.5537 56.9168 44.7116 57.2631 43.7209 57.2631C42.7302 57.2631 41.884 56.9136 41.1823 56.2145C40.4806 55.5155 40.1297 54.6666 40.1297 53.668C40.1297 53.668 40.1297 13.8946 40.1297 13.8946ZM10.0405 30.5748L3.5627 30.5748C2.57306 30.5748 1.73188 30.2281 1.03916 29.5346C0.346387 28.8411 1.77636e-15 27.999 1.77636e-15 27.0083C1.77636e-15 26.0177 0.346387 25.1715 1.03916 24.4697C1.73188 23.768 2.57306 23.4171 3.5627 23.4171L23.6437 23.4171C24.6333 23.4171 25.4745 23.7638 26.1672 24.4573C26.86 25.1508 27.2064 25.9929 27.2064 26.9836C27.2064 27.9742 26.86 28.8204 26.1672 29.5222C25.4745 30.2239 24.6333 30.5748 23.6437 30.5748L17.1659 30.5748L17.1659 53.7004C17.1659 54.6901 16.8191 55.5313 16.1256 56.224C15.4322 56.9168 14.5901 57.2631 13.5994 57.2631C12.6087 57.2631 11.7679 56.9168 11.0769 56.224C10.386 55.5313 10.0405 54.6901 10.0405 53.7004L10.0405 30.5748Z" fill-rule="nonzero" opacity="1" stroke="none" />${svg_tag_end}`,
  location: `${svg_tag_start}<path d="M32 59.0478C38.79 52.9698 43.986 47.1397 47.5879 41.5577C51.1898 35.9757 52.9908 31.0868 52.9908 26.8908C52.9908 20.5636 50.9807 15.362 46.9605 11.2862C42.9403 7.2104 37.9535 5.17249 32 5.17249C26.0465 5.17249 21.0597 7.2104 17.0395 11.2862C13.0193 15.362 11.0092 20.5636 11.0092 26.8908C11.0092 31.0868 12.8102 35.9757 16.4121 41.5577C20.014 47.1397 25.21 52.9698 32 59.0478ZM32 64C31.3237 64 30.6474 63.8832 29.9711 63.6496C29.2947 63.416 28.6829 63.0545 28.1356 62.5651C25.021 59.6951 22.1066 56.7395 19.3923 53.6983C16.6781 50.657 14.3187 47.6169 12.3142 44.5779C10.3097 41.5388 8.72339 38.5264 7.5554 35.5408C6.38735 32.5551 5.80333 29.6718 5.80333 26.8908C5.80333 18.8817 8.39408 12.3976 13.5756 7.43857C18.7571 2.47952 24.8985 0 32 0C39.1015 0 45.2429 2.47952 50.4244 7.43857C55.6059 12.3976 58.1967 18.8817 58.1967 26.8908C58.1967 29.6718 57.6127 32.5496 56.4446 35.5241C55.2766 38.4987 53.6959 41.511 51.7025 44.5612C49.7091 47.6113 47.3553 50.6515 44.6411 53.6817C41.9269 56.7118 39.0124 59.6618 35.8977 62.5317C35.3584 63.0211 34.7456 63.3882 34.0592 63.633C33.3728 63.8777 32.6864 64 32 64ZM32.0059 32.5039C33.7328 32.5039 35.2092 31.889 36.4351 30.6592C37.6609 29.4295 38.2738 27.9511 38.2738 26.2242C38.2738 24.4972 37.6589 23.0209 36.4292 21.795C35.1994 20.5692 33.721 19.9563 31.9941 19.9563C30.2672 19.9563 28.7908 20.5711 27.5649 21.8009C26.3391 23.0307 25.7262 24.509 25.7262 26.236C25.7262 27.9629 26.3411 29.4393 27.5708 30.6651C28.8006 31.891 30.279 32.5039 32.0059 32.5039Z" fill-rule="nonzero" opacity="1" stroke="none"/>${svg_tag_end}`,
  frequency: `${svg_tag_start}<path d="M32 64C27.5733 64 23.4133 63.1601 19.5201 61.4804C15.6267 59.8007 12.24 57.5211 9.36002 54.6417C6.48002 51.7622 4.20001 48.3761 2.52001 44.4834C0.840002 40.5908 1.42109e-14 36.4315 1.42109e-14 32.0056C1.42109e-14 27.5797 0.840002 23.4196 2.52001 19.5253C4.20001 15.6309 6.48002 12.2433 9.36002 9.36255C12.24 6.48176 15.6267 4.20113 19.5201 2.52068C23.4133 0.840227 27.5733 7.10543e-15 32 7.10543e-15C36.4567 7.10543e-15 40.6175 0.835651 44.4826 2.50695C48.3476 4.1782 51.7311 6.46483 54.6332 9.36685C57.5352 12.2689 59.8218 15.6524 61.493 19.5174C63.1643 23.3825 64 27.5433 64 32C64 32.8295 63.959 33.6382 63.8769 34.4262C63.7948 35.2142 63.6825 35.9904 63.54 36.7548C63.4278 37.45 63.1017 37.9855 62.5619 38.3612C62.0221 38.7369 61.4045 38.8513 60.7093 38.7045C60.0141 38.5577 59.4613 38.1921 59.051 37.6077C58.6408 37.0233 58.4918 36.3762 58.6041 35.6665C58.7121 35.0835 58.7963 34.4778 58.8567 33.8494C58.9172 33.2211 58.9474 32.6046 58.9474 32C58.9474 28.2465 58.2543 24.7451 56.8681 21.4958C55.4818 18.2465 53.5536 15.3868 51.0834 12.9166C48.6132 10.4464 45.7535 8.51817 42.5042 7.13189C39.2549 5.74567 35.7535 5.05256 32 5.05256C24.4772 5.05256 18.1052 7.66309 12.8842 12.8842C7.66309 18.1052 5.05256 24.4772 5.05256 32C5.05256 39.5228 7.66309 45.8948 12.8842 51.1158C18.1052 56.3369 24.4772 58.9474 32 58.9474C34.6991 58.9474 37.2837 58.576 39.7539 57.8332C42.2241 57.0905 44.541 56.0087 46.7045 54.5878C47.2962 54.2467 47.9364 54.1179 48.6251 54.2014C49.3139 54.2849 49.8462 54.6188 50.2219 55.2033C50.6537 55.7949 50.7966 56.4351 50.6505 57.1239C50.5044 57.8126 50.1391 58.3449 49.5547 58.7206C46.9593 60.4134 44.1987 61.7165 41.2729 62.6299C38.3471 63.5433 35.2561 64 32 64ZM55.9371 51.3684C54.9944 51.3684 54.1971 51.043 53.545 50.3921C52.8929 49.7412 52.5669 48.9445 52.5669 48.0019C52.5669 47.0592 52.8923 46.2619 53.5432 45.6098C54.1941 44.9577 54.9908 44.6317 55.9335 44.6317C56.8761 44.6317 57.6734 44.9571 58.3255 45.608C58.9776 46.2588 59.3037 47.0556 59.3037 47.9982C59.3037 48.9408 58.9782 49.7382 58.3273 50.3903C57.6765 51.0424 56.8797 51.3684 55.9371 51.3684ZM34.5262 30.9765L45.4737 41.924C45.9401 42.3904 46.1787 42.9766 46.1895 43.6826C46.2003 44.3887 45.9617 44.9857 45.4737 45.4737C44.9857 45.9617 44.3941 46.2057 43.6989 46.2057C43.0036 46.2057 42.412 45.9617 41.924 45.4737L30.3871 33.9368C30.0718 33.6216 29.8408 33.278 29.694 32.9063C29.5472 32.5345 29.4738 32.1504 29.4738 31.7539L29.4738 17.6841C29.4738 16.9684 29.716 16.3684 30.2003 15.8842C30.6848 15.4 31.285 15.1579 32.0011 15.1579C32.7172 15.1579 33.3171 15.4 33.8008 15.8842C34.2844 16.3684 34.5262 16.9684 34.5262 17.6841L34.5262 30.9765Z" fill-rule="nonzero" opacity="1" stroke="none"/>${svg_tag_end}`,
  arrow: `${svg_tag_start}<path d="M41.9205 32.0129L15.8508 5.94326C15.1631 5.25553 14.8281 4.43692 14.8458 3.48743C14.8636 2.53788 15.2163 1.71927 15.904 1.0316C16.5918 0.343866 17.4104-7.10543e-15 18.3599-7.10543e-15C19.3094-7.10543e-15 20.128 0.343866 20.8157 1.0316L47.3113 27.5804C47.937 28.206 48.4006 28.9071 48.7024 29.6835C49.004 30.46 49.1549 31.2365 49.1549 32.0129C49.1549 32.7894 49.004 33.5659 48.7024 34.3424C48.4006 35.1188 47.937 35.8198 47.3113 36.4455L20.7625 62.9943C20.0748 63.682 19.265 64.017 18.3332 63.9993C17.4015 63.9816 16.5918 63.6288 15.904 62.9411C15.2163 62.2534 14.8725 61.4347 14.8725 60.4853C14.8725 59.5358 15.2163 58.7172 15.904 58.0294L41.9205 32.0129Z" fill-rule="nonzero" opacity="1" stroke="none" />${svg_tag_end}`,
  folder: `${svg_tag_start}<path d="M6.08911 57.2631C4.3876 57.2631 2.94738 56.6737 1.76843 55.4947C0.589475 54.3158 6.21725e-15 52.8755 6.21725e-15 51.174L6.21725e-15 12.826C6.21725e-15 11.1245 0.589475 9.68424 1.76843 8.50529C2.94738 7.32634 4.3876 6.73686 6.08911 6.73686L22.0631 6.73686C22.875 6.73686 23.6555 6.8945 24.4048 7.20979C25.154 7.52502 25.805 7.95901 26.3578 8.51177L31.3197 13.4737L57.9109 13.4737C59.6124 13.4737 61.0526 14.0632 62.2316 15.2421C63.4105 16.4211 64 17.8613 64 19.5628L64 51.174C64 52.8755 63.4105 54.3158 62.2316 55.4947C61.0526 56.6737 59.6124 57.2631 57.9109 57.2631L6.08911 57.2631ZM6.08911 52.2106L57.9109 52.2106C58.2132 52.2106 58.4615 52.1134 58.6559 51.919C58.8503 51.7247 58.9474 51.4763 58.9474 51.174L58.9474 19.5628C58.9474 19.2605 58.8503 19.0122 58.6559 18.8178C58.4615 18.6235 58.2132 18.5263 57.9109 18.5263L29.2535 18.5263L22.8081 12.081C22.7001 11.973 22.5868 11.8974 22.468 11.8542C22.3492 11.811 22.225 11.7894 22.0955 11.7894L6.08911 11.7894C5.78679 11.7894 5.53846 11.8866 5.3441 12.081C5.14974 12.2753 5.05256 12.5237 5.05256 12.826L5.05256 51.174C5.05256 51.4763 5.14974 51.7247 5.3441 51.919C5.53846 52.1134 5.78679 52.2106 6.08911 52.2106ZM5.05256 52.2106L5.05256 11.7894L5.05256 52.2106Z" fill-rule="nonzero" opacity="1" stroke="none"/>${svg_tag_end}`,
  inventory: `${svg_tag_start}<path d="M9.45754 64C7.77765 64 6.34284 63.4051 5.15311 62.2153C3.96332 61.0256 3.36843 59.5908 3.36843 57.9109L3.36843 20.191C2.37952 19.6815 1.5709 18.957 0.942571 18.0177C0.31419 17.0784 7.10543e-15 15.9956 7.10543e-15 14.7691L7.10543e-15 6.08911C7.10543e-15 4.40922 0.594893 2.97441 1.78468 1.78468C2.97441 0.594893 4.40922-4.44089e-15 6.08911-4.44089e-15L57.9109-4.44089e-15C59.5908-4.44089e-15 61.0256 0.594893 62.2153 1.78468C63.4051 2.97441 64 4.40922 64 6.08911L64 14.7691C64 15.9956 63.6858 17.0784 63.0574 18.0177C62.4291 18.957 61.6205 19.6815 60.6316 20.191L60.6316 57.9109C60.6316 59.5908 60.0367 61.0256 58.8469 62.2153C57.6572 63.4051 56.2224 64 54.5425 64L9.45754 64ZM8.42099 20.8582L8.42099 57.749C8.42099 58.0944 8.54515 58.3806 8.79345 58.6073C9.04182 58.8341 9.34955 58.9474 9.71666 58.9474L54.5425 58.9474C54.8448 58.9474 55.0931 58.8503 55.2875 58.6559C55.4818 58.4615 55.579 58.2132 55.579 57.9109L55.579 20.8582L8.42099 20.8582ZM6.08911 15.8057L57.9109 15.8057C58.2132 15.8057 58.4615 15.7085 58.6559 15.5141C58.8503 15.3198 58.9474 15.0715 58.9474 14.7691L58.9474 6.08911C58.9474 5.78679 58.8503 5.53846 58.6559 5.3441C58.4615 5.14974 58.2132 5.05256 57.9109 5.05256L6.08911 5.05256C5.78679 5.05256 5.53846 5.14974 5.3441 5.3441C5.14974 5.53846 5.05256 5.78679 5.05256 6.08911L5.05256 14.7691C5.05256 15.0715 5.14974 15.3198 5.3441 15.5141C5.53846 15.7085 5.78679 15.8057 6.08911 15.8057ZM24.9716 36.8258L39.0607 36.8258C39.756 36.8258 40.3293 36.5948 40.7806 36.1327C41.2318 35.6706 41.4575 35.092 41.4575 34.3967C41.4575 33.7014 41.2318 33.1281 40.7806 32.6769C40.3293 32.2256 39.756 32 39.0607 32L24.9393 32C24.244 32 23.6707 32.2256 23.2194 32.6769C22.7682 33.1281 22.5425 33.7014 22.5425 34.3967C22.5425 35.092 22.7736 35.6706 23.2356 36.1327C23.6977 36.5948 24.2764 36.8258 24.9716 36.8258Z" fill-rule="nonzero" opacity="1" stroke="none"/>${svg_tag_end}`,
  data_usage: `${svg_tag_start}<path d="M32 63.4805C27.5779 63.4805 23.4202 62.6394 19.5271 60.9574C15.634 59.2753 12.2472 56.9941 9.36685 54.1136C6.48639 51.2332 4.20515 47.8465 2.52312 43.9534C0.841041 40.0602 6.21725e-15 35.9026 6.21725e-15 31.4805C6.21725e-15 24.2254 2.16467 17.7649 6.494 12.099C10.8233 6.43322 16.5011 2.64377 23.5272 0.730669C24.6802 0.342008 25.7339 0.489911 26.6883 1.17438C27.6427 1.85884 28.1198 2.77758 28.1198 3.93059C28.1198 4.72947 27.8942 5.45172 27.4429 6.09734C26.9917 6.74295 26.4119 7.18017 25.7037 7.409C20.2062 8.77367 15.7355 11.6865 12.2914 16.1476C8.84735 20.6086 7.12532 25.7196 7.12532 31.4805C7.12532 38.3944 9.54262 44.2687 14.3772 49.1033C19.2118 53.9379 25.0861 56.3552 32 56.3552C35.3512 56.3552 38.5718 55.7203 41.6617 54.4506C44.7516 53.181 47.428 51.3758 49.6909 49.0351C50.2955 48.4435 51.0177 48.1369 51.8577 48.1154C52.6976 48.0938 53.4306 48.3572 54.0567 48.9056C54.9593 49.6959 55.4279 50.6243 55.4624 51.691C55.4969 52.7576 55.0521 53.7119 54.128 54.5541C51.118 57.4734 47.741 59.6909 43.9968 61.2067C40.2527 62.7226 36.2537 63.4805 32 63.4805ZM56.8747 31.4805C56.8747 25.7541 55.1332 20.655 51.6503 16.1832C48.1674 11.7114 43.6879 8.78663 38.2121 7.409C37.4823 7.18017 36.8917 6.74295 36.4404 6.09734C35.9892 5.45172 35.7635 4.72947 35.7635 3.93059C35.7635 2.77758 36.2461 1.86426 37.2113 1.19063C38.1765 0.516942 39.2356 0.363623 40.3886 0.730669C47.3845 2.5919 53.0687 6.37706 57.4412 12.0862C61.8137 17.7952 64 24.26 64 31.4805C64 32.7933 63.9201 34.0932 63.7603 35.3801C63.6005 36.6671 63.3327 37.9713 62.957 39.2927C62.7411 40.4242 62.1451 41.2328 61.1692 41.7186C60.1932 42.2044 59.1396 42.2357 58.0082 41.8125C57.2438 41.5275 56.6641 41.0169 56.2689 40.2806C55.8738 39.5443 55.7669 38.7659 55.9483 37.9454C56.2463 36.7319 56.4752 35.5982 56.6349 34.5445C56.7948 33.4908 56.8747 32.4694 56.8747 31.4805Z" fill-rule="nonzero" opacity="1" stroke="none"/>${svg_tag_end}`,
  info: `${svg_tag_start}<path d="M32.0011 48C32.7172 48 33.3171 47.7579 33.8008 47.2736C34.2844 46.7895 34.5262 46.1895 34.5262 45.4737L34.5262 31.1578C34.5262 30.4421 34.284 29.8421 33.7997 29.3579C33.3152 28.8737 32.715 28.6316 31.9989 28.6316C31.2828 28.6316 30.6829 28.8737 30.1992 29.3579C29.7156 29.8421 29.4738 30.4421 29.4738 31.1578L29.4738 45.4737C29.4738 46.1895 29.716 46.7895 30.2003 47.2736C30.6848 47.7579 31.285 48 32.0011 48ZM32 22.8664C32.7709 22.8664 33.417 22.6057 33.9384 22.0843C34.4599 21.5628 34.7206 20.9167 34.7206 20.1458C34.7206 19.375 34.4599 18.7289 33.9384 18.2074C33.417 17.6859 32.7709 17.4252 32 17.4252C31.2291 17.4252 30.583 17.6859 30.0616 18.2074C29.5401 18.7289 29.2794 19.375 29.2794 20.1458C29.2794 20.9167 29.5401 21.5628 30.0616 22.0843C30.583 22.6057 31.2291 22.8664 32 22.8664ZM32.0056 64C27.5797 64 23.4196 63.1601 19.5253 61.4804C15.6309 59.8007 12.2433 57.5211 9.36255 54.6417C6.48176 51.7622 4.20113 48.3761 2.52068 44.4834C0.840227 40.5908 7.10543e-15 36.4315 7.10543e-15 32.0056C7.10543e-15 27.5797 0.839862 23.4196 2.51959 19.5253C4.19931 15.6309 6.47889 12.2433 9.35834 9.36255C12.2378 6.48176 15.6239 4.20113 19.5166 2.52068C23.4092 0.840227 27.5685-4.44089e-15 31.9944-4.44089e-15C36.4203-4.44089e-15 40.5804 0.839862 44.4747 2.51959C48.3691 4.19931 51.7567 6.47889 54.6374 9.35834C57.5182 12.2378 59.7989 15.6239 61.4793 19.5166C63.1598 23.4092 64 27.5685 64 31.9944C64 36.4203 63.1601 40.5804 61.4804 44.4747C59.8007 48.3691 57.5211 51.7567 54.6417 54.6374C51.7622 57.5182 48.3761 59.7989 44.4834 61.4793C40.5908 63.1598 36.4315 64 32.0056 64ZM32 58.9474C39.5228 58.9474 45.8948 56.3369 51.1158 51.1158C56.3369 45.8948 58.9474 39.5228 58.9474 32C58.9474 24.4772 56.3369 18.1052 51.1158 12.8842C45.8948 7.66309 39.5228 5.05256 32 5.05256C24.4772 5.05256 18.1052 7.66309 12.8842 12.8842C7.66309 18.1052 5.05256 24.4772 5.05256 32C5.05256 39.5228 7.66309 45.8948 12.8842 51.1158C18.1052 56.3369 24.4772 58.9474 32 58.9474Z" fill-rule="nonzero" opacity="1" stroke="none"/>${svg_tag_end}`,
  github: `${svg_tag_start}<path d="M31.9021 0.868073C14.2875 0.868073 3.55271e-15 15.1555 3.55271e-15 32.7702C3.55271e-15 46.862 9.19878 58.8008 21.7248 63.1066C23.2905 63.3023 23.8777 62.3237 23.8777 61.5409C23.8777 60.758 23.8777 58.8008 23.8777 56.0607C15.0703 58.0179 13.1131 51.7549 13.1131 51.7549C11.7431 48.0363 9.59021 47.0577 9.59021 47.0577C6.65443 45.1005 9.78593 45.1005 9.78593 45.1005C12.9174 45.2962 14.6789 48.4277 14.6789 48.4277C17.6147 53.3207 22.1162 51.9506 23.8777 51.1678C24.0734 49.0149 25.052 47.6448 25.8349 46.862C18.789 46.0791 11.3517 43.339 11.3517 31.0087C11.3517 27.4858 12.526 24.7457 14.6789 22.3971C14.2875 21.6143 13.3089 18.287 15.0703 13.9812C15.0703 13.9812 17.8104 13.1983 23.8777 17.3084C26.422 16.5256 29.1621 16.3298 31.9021 16.3298C34.6422 16.3298 37.3823 16.7213 39.9266 17.3084C45.9939 13.1983 48.7339 13.9812 48.7339 13.9812C50.4954 18.287 49.3211 21.6143 49.1254 22.3971C51.0826 24.55 52.4526 27.4858 52.4526 31.0087C52.4526 43.339 45.0153 45.8834 37.9694 46.6662C39.1437 47.6448 40.1223 49.602 40.1223 52.5378C40.1223 56.8436 40.1223 60.1708 40.1223 61.3451C40.1223 62.128 40.7095 63.1066 42.2752 62.9109C54.9969 58.6051 64 46.6662 64 32.5745C63.8043 15.1555 49.5168 0.868073 31.9021 0.868073Z" fill-rule="evenodd" opacity="1" stroke="none"/>${svg_tag_end}`,
  money: `${svg_tag_start}<path d="M31.6567 64C30.8784 64 30.2267 63.7374 29.7016 63.2123C29.1764 62.6872 28.9139 62.0355 28.9139 61.2572L28.9139 56.3481C26.1007 55.8558 23.6521 54.8595 21.5679 53.3591C19.4838 51.8588 17.8135 49.7724 16.557 47.0998C16.2475 46.4575 16.244 45.7752 16.5464 45.0532C16.8488 44.3312 17.3775 43.8155 18.1323 43.506C18.7746 43.2341 19.4474 43.2434 20.1507 43.5341C20.8539 43.8249 21.3791 44.3101 21.7261 44.9899C22.7857 47.0061 24.1489 48.5451 25.8158 49.6072C27.4826 50.6692 29.603 51.2001 32.1771 51.2001C34.8169 51.2001 37.146 50.5718 39.1644 49.3152C41.1829 48.0587 42.1922 46.066 42.1922 43.3372C42.1922 40.9694 41.4338 39.0787 39.917 37.665C38.4002 36.2514 35.2623 34.7757 30.5033 33.2378C25.5193 31.6624 22.0579 29.8198 20.1191 27.7099C18.1804 25.6 17.211 22.9462 17.211 19.7485C17.211 16.068 18.5027 13.1716 21.0862 11.0593C23.6697 8.94707 26.2789 7.77374 28.9139 7.53931L28.9139 2.74277C28.9139 1.96447 29.1764 1.31277 29.7016 0.787659C30.2267 0.262553 30.8784 0 31.6567 0C32.435 0 33.0867 0.262553 33.6118 0.787659C34.1369 1.31277 34.3995 1.96447 34.3995 2.74277L34.3995 7.53931C36.6454 7.83469 38.6158 8.48758 40.3107 9.49799C42.0056 10.5084 43.4251 11.8365 44.5692 13.4822C44.9771 14.087 45.0662 14.7481 44.8365 15.4655C44.6067 16.1828 44.1144 16.7079 43.3595 17.0408C42.7172 17.3362 42.0503 17.369 41.3587 17.1392C40.6671 16.9095 40.0307 16.4735 39.4493 15.8312C38.5866 14.8372 37.5515 14.0529 36.3442 13.4785C35.1369 12.9042 33.6354 12.617 31.8396 12.617C29.0873 12.617 26.8754 13.2875 25.2039 14.6284C23.5324 15.9694 22.6966 17.6761 22.6966 19.7485C22.6966 21.8772 23.5523 23.5792 25.2637 24.8545C26.975 26.1298 30.1563 27.4661 34.8074 28.8634C39.1304 30.1761 42.3562 32.0469 44.4848 34.4756C46.6135 36.9043 47.6778 39.8207 47.6778 43.2246C47.6778 47.224 46.3919 50.3279 43.8201 52.5363C41.2484 54.7447 38.1082 56.0528 34.3995 56.4607L34.3995 61.2572C34.3995 62.0355 34.1369 62.6872 33.6118 63.2123C33.0867 63.7374 32.435 64 31.6567 64Z" fill-rule="nonzero" opacity="1" stroke="none"/>${svg_tag_end}`,
  company: `${svg_tag_start}<path d="M5.04574 61.0619C3.64484 61.0619 2.45366 60.5712 1.4722 59.5896C0.490732 58.6082 0 57.417 0 56.0161L0 7.9839C0 6.583 0.490732 5.3918 1.4722 4.41028C2.45366 3.42881 3.64484 2.93808 5.04574 2.93808L26.507 2.93808C27.9079 2.93808 29.0991 3.42881 30.0806 4.41028C31.0621 5.3918 31.5528 6.583 31.5528 7.9839L31.5528 16.2235L58.9542 16.2235C60.3551 16.2235 61.5463 16.7143 62.5277 17.6957C63.5092 18.6773 64 19.8685 64 21.2694L64 56.0161C64 57.417 63.5092 58.6082 62.5277 59.5896C61.5463 60.5712 60.3551 61.0619 58.9542 61.0619L5.04574 61.0619ZM4.98188 56.08L26.5709 56.08L26.5709 47.7765L4.98188 47.7765L4.98188 56.08ZM4.98188 42.7945L26.5709 42.7945L26.5709 34.491L4.98188 34.491L4.98188 42.7945ZM4.98188 29.509L26.5709 29.509L26.5709 21.2055L4.98188 21.2055L4.98188 29.509ZM4.98188 16.2235L26.5709 16.2235L26.5709 7.92005L4.98188 7.92005L4.98188 16.2235ZM31.5528 56.08L59.018 56.08L59.018 21.2055L31.5528 21.2055L31.5528 56.08ZM41.3253 34.491C40.6195 34.491 40.0279 34.2521 39.5505 33.7745C39.0731 33.2968 38.8343 32.7049 38.8343 31.9989C38.8343 31.2928 39.0731 30.7012 39.5505 30.2244C40.0279 29.7475 40.6195 29.509 41.3253 29.509L48.6068 29.509C49.3126 29.509 49.9042 29.7479 50.3816 30.2255C50.859 30.7031 51.0977 31.295 51.0977 32.0011C51.0977 32.7072 50.859 33.2987 50.3816 33.7756C49.9042 34.2525 49.3126 34.491 48.6068 34.491L41.3253 34.491ZM41.3253 47.7765C40.6195 47.7765 40.0279 47.5376 39.5505 47.0599C39.0731 46.5823 38.8343 45.9904 38.8343 45.2843C38.8343 44.5782 39.0731 43.9867 39.5505 43.5098C40.0279 43.0329 40.6195 42.7945 41.3253 42.7945L48.6068 42.7945C49.3126 42.7945 49.9042 43.0333 50.3816 43.511C50.859 43.9886 51.0977 44.5805 51.0977 45.2866C51.0977 45.9927 50.859 46.5842 50.3816 47.0611C49.9042 47.538 49.3126 47.7765 48.6068 47.7765L41.3253 47.7765Z" fill-rule="nonzero" opacity="1" stroke="none"/>${svg_tag_end}`,
  phone: `${svg_tag_start}<path d="M60.0108 64C52.9158 64 45.7882 62.3505 38.6281 59.0516C31.4679 55.7526 24.8893 51.0986 18.8924 45.0895C12.8954 39.0805 8.2474 32.5019 4.94844 25.3539C1.64948 18.2057 0 11.0842 0 3.98919C0 2.84942 0.376472 1.89961 1.12942 1.13977C1.88236 0.379923 2.82354 0 3.95295 0L16.2316 0C17.1824 0 18.021 0.310119 18.7474 0.930356C19.4738 1.55059 19.936 2.31681 20.1338 3.229L22.2913 14.3058C22.4409 15.3339 22.4095 16.2172 22.1971 16.9556C21.9848 17.6941 21.6035 18.3143 21.0532 18.8162L12.3582 27.2796C13.758 29.8425 15.3568 32.2666 17.1547 34.552C18.9526 36.8374 20.8989 39.0203 22.9936 41.1005C25.0594 43.1663 27.2555 45.0849 29.5819 46.8562C31.9083 48.6276 34.4206 50.2758 37.1186 51.801L45.5675 43.2798C46.1563 42.6668 46.8695 42.2372 47.7069 41.9911C48.5443 41.7449 49.4143 41.6846 50.3169 41.8101L60.771 43.9386C61.7218 44.1896 62.4977 44.6746 63.0986 45.3937C63.6995 46.1129 64 46.9286 64 47.8409L64 60.047C64 61.1765 63.6201 62.1176 62.8602 62.8706C62.1004 63.6235 61.1506 64 60.0108 64ZM9.6868 21.9367L16.4054 15.5077C16.5261 15.4112 16.6045 15.2784 16.6407 15.1095C16.6769 14.9405 16.6709 14.7837 16.6226 14.6389L14.9864 6.22618C14.9381 6.03312 14.8537 5.88833 14.733 5.79183C14.6124 5.69526 14.4555 5.64698 14.2624 5.64698L6.21169 5.64698C6.06694 5.64698 5.94628 5.69526 5.84971 5.79183C5.75315 5.88833 5.70486 6.00899 5.70486 6.15381C5.89793 8.72636 6.31905 11.34 6.96821 13.9946C7.61743 16.6492 8.52363 19.2966 9.6868 21.9367ZM42.4397 54.4724C44.9351 55.6357 47.5379 56.525 50.248 57.1404C52.9581 57.7557 55.4909 58.1213 57.8462 58.2372C57.991 58.2372 58.1117 58.1889 58.2082 58.0924C58.3047 57.9958 58.353 57.8752 58.353 57.7303L58.353 49.81C58.353 49.617 58.3047 49.4601 58.2082 49.3393C58.1117 49.2187 57.9669 49.1342 57.7738 49.086L49.8679 47.4787C49.7232 47.4305 49.5965 47.4245 49.4879 47.4607C49.3793 47.4969 49.2646 47.5753 49.144 47.696L42.4397 54.4724Z" fill-rule="nonzero" opacity="1" stroke="none"/>${svg_tag_end}`,
  email: `${svg_tag_start}<path d="M32 64C27.5733 64 23.4133 63.1601 19.5201 61.4804C15.6267 59.8007 12.24 57.5211 9.36002 54.6417C6.48002 51.7622 4.20001 48.3761 2.52001 44.4834C0.840002 40.5908 1.42109e-14 36.4315 1.42109e-14 32.0056C1.42109e-14 27.5797 0.839862 23.4196 2.51959 19.5253C4.19931 15.6309 6.47889 12.2433 9.35834 9.36255C12.2378 6.48176 15.6239 4.20113 19.5166 2.52068C23.4092 0.840227 27.5685 0 31.9944 0C36.4203 0 40.5804 0.840002 44.4747 2.52001C48.3691 4.20001 51.7567 6.48002 54.6374 9.36002C57.5182 12.24 59.7989 15.6267 61.4793 19.5201C63.1598 23.4133 64 27.5733 64 32L64 36.1069C64 39.1816 62.9444 41.7921 60.8331 43.9384C58.7218 46.0847 56.1283 47.1579 53.0526 47.1579C51.0661 47.1579 49.2243 46.672 47.5271 45.7003C45.8299 44.7287 44.489 43.3921 43.5045 41.6906C42.0491 43.4266 40.3293 44.7718 38.3449 45.7262C36.3606 46.6806 34.2456 47.1579 32 47.1579C27.7938 47.1579 24.216 45.6831 21.2664 42.7336C18.3169 39.784 16.8421 36.2062 16.8421 32C16.8421 27.7938 18.3169 24.216 21.2664 21.2664C24.216 18.3169 27.7938 16.8421 32 16.8421C36.2062 16.8421 39.784 18.3169 42.7336 21.2664C45.6831 24.216 47.1579 27.7938 47.1579 32L47.1579 36.1069C47.1579 37.7608 47.7268 39.1741 48.8647 40.3465C50.0026 41.519 51.3986 42.1053 53.0526 42.1053C54.7066 42.1053 56.1026 41.519 57.2406 40.3465C58.3785 39.1741 58.9474 37.7608 58.9474 36.1069L58.9474 32C58.9474 24.4772 56.3369 18.1052 51.1158 12.8842C45.8948 7.66309 39.5228 5.05256 32 5.05256C24.4772 5.05256 18.1052 7.66309 12.8842 12.8842C7.66309 18.1052 5.05256 24.4772 5.05256 32C5.05256 39.5228 7.66309 45.8948 12.8842 51.1158C18.1052 56.3369 24.4772 58.9474 32 58.9474L46.3159 58.9474C47.0316 58.9474 47.6316 59.1897 48.1158 59.6741C48.6 60.1585 48.8421 60.7587 48.8421 61.4749C48.8421 62.1909 48.6 62.7908 48.1158 63.2744C47.6316 63.7581 47.0316 64 46.3159 64L32 64ZM32 42.1053C34.807 42.1053 37.193 41.1228 39.1579 39.1579C41.1228 37.193 42.1053 34.807 42.1053 32C42.1053 29.193 41.1228 26.807 39.1579 24.8421C37.193 22.8772 34.807 21.8947 32 21.8947C29.193 21.8947 26.807 22.8772 24.8421 24.8421C22.8772 26.807 21.8947 29.193 21.8947 32C21.8947 34.807 22.8772 37.193 24.8421 39.1579C26.807 41.1228 29.193 42.1053 32 42.1053Z" fill-rule="nonzero" opacity="1" stroke="none"/>${svg_tag_end}`,
  backspace: `${svg_tag_start}<path d="M20.3738 57.0777C19.0383 57.0777 17.7831 56.7759 16.6083 56.1725C15.4336 55.569 14.4678 54.7281 13.7111 53.6498L1.29835 36.0287C0.432784 34.8021 0 33.4591 0 32C0 30.5409 0.432784 29.1979 1.29835 27.9713L13.7111 10.4243C14.4678 9.34607 15.4274 8.49284 16.5898 7.86468C17.7522 7.23645 19.0135 6.92233 20.3738 6.92233L57.0257 6.92233C58.9498 6.92233 60.5932 7.60371 61.9559 8.96646C63.3186 10.3291 64 11.9725 64 13.8967L64 50.1033C64 52.0275 63.3186 53.6709 61.9559 55.0335C60.5932 56.3963 58.9498 57.0777 57.0257 57.0777L20.3738 57.0777ZM58.2129 51.2906L58.2129 12.7094L58.2129 51.2906ZM20.3738 51.2906L57.0257 51.2906C57.3225 51.2906 57.5946 51.1669 57.842 50.9196C58.0893 50.6723 58.2129 50.4002 58.2129 50.1033L58.2129 13.8967C58.2129 13.5998 58.0893 13.3277 57.842 13.0804C57.5946 12.8331 57.3225 12.7094 57.0257 12.7094L20.3738 12.7094C20.0027 12.7094 19.6503 12.8022 19.3164 12.9877C18.9825 13.1732 18.7166 13.402 18.5188 13.674L5.97256 31.2951C5.82415 31.493 5.74995 31.7279 5.74995 32C5.74995 32.2721 5.82415 32.507 5.97256 32.7049L18.5188 50.326C18.7166 50.598 18.9825 50.8268 19.3164 51.0123C19.6503 51.1978 20.0027 51.2906 20.3738 51.2906ZM38.2545 36.0658L46.2528 44.0639C46.7869 44.5982 47.4584 44.8715 48.2671 44.8838C49.0758 44.8962 49.7596 44.6229 50.3185 44.0639C50.8774 43.505 51.1569 42.8274 51.1569 42.0311C51.1569 41.2348 50.8774 40.5572 50.3185 39.9983L42.3203 32L50.3185 24.0017C50.8527 23.4676 51.126 22.7961 51.1384 21.9874C51.1507 21.1788 50.8774 20.495 50.3185 19.9361C49.7596 19.3771 49.082 19.0976 48.2856 19.0976C47.4893 19.0976 46.8117 19.3771 46.2528 19.9361L38.2545 27.9342L30.2563 19.9361C29.7221 19.4018 29.0507 19.1285 28.242 19.1162C27.4333 19.1038 26.7495 19.3771 26.1905 19.9361C25.6316 20.495 25.3522 21.1726 25.3522 21.9689C25.3522 22.7652 25.6316 23.4428 26.1905 24.0017L34.1888 32L26.1905 39.9983C25.6564 40.5324 25.3831 41.2039 25.3707 42.0126C25.3583 42.8212 25.6316 43.505 26.1905 44.0639C26.7495 44.6229 27.4271 44.9024 28.2234 44.9024C29.0198 44.9024 29.6974 44.6229 30.2563 44.0639L38.2545 36.0658Z" fill-rule="nonzero" opacity="1" stroke="none"/>${svg_tag_end}`,
  label: `${svg_tag_start}<path d="M62.7016 36.0287L50.2889 53.6498C49.5322 54.7281 48.5664 55.569 47.3917 56.1725C46.2169 56.7759 44.9617 57.0777 43.6262 57.0777L6.97432 57.0777C5.05021 57.0777 3.40681 56.3963 2.04413 55.0335C0.681376 53.6709 7.10543e-15 52.0275 7.10543e-15 50.1033L7.10543e-15 13.8967C7.10543e-15 11.9725 0.681376 10.3291 2.04413 8.96646C3.40681 7.60371 5.05021 6.92233 6.97432 6.92233L43.6262 6.92233C44.9865 6.92233 46.2478 7.23645 47.4102 7.86468C48.5726 8.49284 49.5322 9.34607 50.2889 10.4243L62.7016 27.9713C63.5672 29.1979 64 30.5409 64 32C64 33.4591 63.5672 34.8021 62.7016 36.0287ZM43.6262 51.2906C43.9973 51.2906 44.3497 51.1978 44.6836 51.0123C45.0175 50.8268 45.2834 50.598 45.4812 50.326L58.0274 32.7049C58.1758 32.507 58.2501 32.2721 58.2501 32C58.2501 31.7279 58.1758 31.493 58.0274 31.2951L45.4812 13.674C45.2834 13.402 45.0175 13.1732 44.6836 12.9877C44.3497 12.8022 43.9973 12.7094 43.6262 12.7094L6.97432 12.7094C6.6775 12.7094 6.40541 12.8331 6.15804 13.0804C5.91073 13.3277 5.78708 13.5998 5.78708 13.8967L5.78708 50.1033C5.78708 50.4002 5.91073 50.6723 6.15804 50.9196C6.40541 51.1669 6.6775 51.2906 6.97432 51.2906L43.6262 51.2906ZM5.78708 12.7094L5.78708 51.2906L5.78708 12.7094Z" fill-rule="nonzero" opacity="1" stroke="none"/>${svg_tag_end}`,
  personal_places: `${svg_tag_start}<path d="M6.63836 60.9525L6.63836 6.17329C6.63836 4.45937 7.23877 3.00202 8.43961 1.80125C9.64038 0.600418 11.0977 0 12.8116 0L42.3815 0C43.6057 0 44.7479 0.278723 45.8081 0.836169C46.8682 1.39362 47.7317 2.16203 48.3986 3.1414L56.0566 14.0816C56.9266 15.3736 57.3616 16.775 57.3616 18.2857C57.3616 19.7964 56.9266 21.1978 56.0566 22.4898L48.3986 33.43C47.7317 34.4094 46.8682 35.1778 45.8081 35.7352C44.7479 36.2927 43.6057 36.5714 42.3815 36.5714L12.7335 36.5714L12.7335 60.9525C12.7335 61.8172 12.4418 62.5413 11.8583 63.1248C11.2749 63.7083 10.5508 64 9.68599 64C8.82121 64 8.09709 63.7083 7.51364 63.1248C6.93012 62.5413 6.63836 61.8172 6.63836 60.9525ZM12.7335 30.4762L42.5456 30.4762C42.754 30.4762 42.9428 30.4307 43.1121 30.3395C43.2815 30.2483 43.4313 30.1115 43.5616 29.9292L50.868 18.9891C50.9982 18.7806 51.0633 18.5462 51.0633 18.2857C51.0633 18.0252 50.9982 17.7908 50.868 17.5823L43.5616 6.64222C43.4313 6.4599 43.2815 6.32313 43.1121 6.2319C42.9428 6.14074 42.754 6.09517 42.5456 6.09517L12.7335 6.09517L12.7335 30.4762ZM12.7335 30.4762L12.7335 6.09517L12.7335 30.4762Z" fill-rule="nonzero" opacity="1" stroke="none"/>${svg_tag_end}`,
  positioning: `${svg_tag_start}<path d="M26.0181 38.0019L2.30254 28.395C1.48741 28.0773 0.89987 27.5928 0.539922 26.9415C0.179974 26.29 1.42109e-14 25.6231 1.42109e-14 24.9406C1.42109e-14 24.2582 0.197177 23.5889 0.59153 22.9325C0.985884 22.2762 1.59063 21.7892 2.40576 21.4716L58.9268 0.308173C59.6632-0.00119931 60.3768-0.0617182 61.0676 0.126616C61.7583 0.31502 62.3548 0.660414 62.8572 1.1628C63.3596 1.66512 63.705 2.26167 63.8933 2.95246C64.0817 3.64318 64.0206 4.35661 63.71 5.09274L42.4639 61.5879C42.1533 62.3854 41.6719 62.9835 41.0195 63.3821C40.3673 63.7809 39.6995 63.9803 39.0161 63.9803C38.3328 63.9803 37.6619 63.7929 37.0035 63.4182C36.3451 63.0434 35.8592 62.4501 35.5457 61.6381L26.0181 38.0019ZM38.8803 53.4209L56.0777 7.94233L10.5198 25.0603L30.7501 33.1906L38.8803 53.4209Z" fill-rule="nonzero" opacity="1" stroke="none"/>${svg_tag_end}`
};
