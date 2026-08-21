'use client';

import { useEffect, useRef } from 'react';
import { ScanBar } from './Icons';

function loadSwiperScript() {
  return new Promise((resolve) => {
    if (window.Swiper) return resolve();
    const existing = document.querySelector('script[data-swiper]');
    if (existing) {
      existing.addEventListener('load', () => resolve());
      return;
    }
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.js';
    script.dataset.swiper = 'true';
    script.onload = () => resolve();
    document.body.appendChild(script);
  });
}

export default function GallerySwiper({ gallery }) {
  const containerRef = useRef(null);

  useEffect(() => {
    let swiperInstance;
    let cancelled = false;

    loadSwiperScript().then(() => {
      if (cancelled || !containerRef.current) return;
      swiperInstance = new window.Swiper(containerRef.current, {
        slidesPerView: 1,
        spaceBetween: 16,
        loop: true,
        autoplay: { delay: 3000, disableOnInteraction: false },
        navigation: {
          nextEl: containerRef.current.querySelector('.swiper-button-next'),
          prevEl: containerRef.current.querySelector('.swiper-button-prev'),
        },
        breakpoints: { 640: { slidesPerView: 2 }, 1024: { slidesPerView: 3 } },
      });
    });

    return () => {
      cancelled = true;
      swiperInstance?.destroy?.(true, true);
    };
  }, [gallery]);

  return (
    <div className="mt-14">
      <div className="mb-6 flex items-end justify-between">
        <div>
          <span className="eyebrow">Unit terpasang di lapangan</span>
          <p className="mt-1 text-lg font-semibold" style={{ color: 'var(--ink)' }}>
            Galeri Mesin &amp; Instalasi
          </p>
        </div>
        <ScanBar size="sm" />
      </div>

      <div className="swiper gallery-main-swiper" style={{ paddingBottom: '2.5rem' }} ref={containerRef}>
        <div className="swiper-wrapper">
          {gallery.map((item, i) => (
            <div className="swiper-slide" key={i}>
              <div
                className="group relative w-full overflow-hidden rounded-xl shadow-md"
                style={{ aspectRatio: '4/3' }}
                onMouseEnter={(e) => {
                  const img = e.currentTarget.querySelector('img');
                  const overlay = e.currentTarget.querySelectorAll('.absolute')[0];
                  const caption = e.currentTarget.querySelectorAll('.absolute')[1];
                  if (img) img.style.transform = 'scale(1.05)';
                  if (overlay) overlay.style.opacity = '1';
                  if (caption) { caption.style.opacity = '1'; caption.style.transform = 'translateY(0)'; }
                }}
                onMouseLeave={(e) => {
                  const img = e.currentTarget.querySelector('img');
                  const overlay = e.currentTarget.querySelectorAll('.absolute')[0];
                  const caption = e.currentTarget.querySelectorAll('.absolute')[1];
                  if (img) img.style.transform = '';
                  if (overlay) overlay.style.opacity = '0';
                  if (caption) { caption.style.opacity = '0'; caption.style.transform = 'translateY(8px)'; }
                }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={item.src}
                  alt={item.caption}
                  style={{ width: '100%', height: '100%', objectFit: 'contain', display: 'block', transition: 'transform .5s' }}
                />
                <div
                  className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"
                  style={{ opacity: 0, transition: 'opacity .3s' }}
                ></div>
                <div className="absolute bottom-0 left-0 right-0 p-4" style={{ opacity: 0, transform: 'translateY(8px)', transition: 'all .3s' }}>
                  <p className="text-sm font-medium text-white drop-shadow">{item.caption}</p>
                </div>
                <div className="absolute left-0 top-0 h-1 w-12 rounded-br" style={{ background: 'var(--navy)' }}></div>
              </div>
            </div>
          ))}
        </div>
        <div className="swiper-button-prev"></div>
        <div className="swiper-button-next"></div>
      </div>
    </div>
  );
}
