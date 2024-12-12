import React, { useRef } from 'react';
import { Button, Space } from 'antd';
import { Welcome } from '@ant-design/x';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import type { Swiper as SwiperType } from 'swiper';
import {
  LeftOutlined,
  RightOutlined,
  FileTextOutlined,
  FilePdfOutlined,
  SearchOutlined,
  FormOutlined,
} from '@ant-design/icons';
import 'swiper/css';
import 'swiper/css/navigation';
import './index.less';

interface ServiceCard {
  icon: React.ReactNode;
  title: string;
  description: string;
  iconColor: 'purple' | 'red' | 'green';
}

const services: ServiceCard[] = [
  {
    icon: <FileTextOutlined />,
    title: '问题解答',
    description: 'AI助手',
    iconColor: 'purple',
  },
  {
    icon: <FilePdfOutlined />,
    title: '增加注释',
    description: '批量为代码增加注释',
    iconColor: 'red',
  },
  {
    icon: <SearchOutlined />,
    title: '调整依赖顺序',
    description: '批量调整代码的依赖顺序',
    iconColor: 'purple',
  },
];

const PromptList = () => {
  const swiperRef = useRef<SwiperType | null>(null);
  return (
    <div className="service-container">
      <div className="header">
        <div className="sub-text">
          我可以帮助你完成不同场景下的任务，快试试吧！
        </div>
      </div>

      <div className="cards-container">
        <div className="nav-buttons">
          <Button
            type="text"
            className="nav-button prev"
            icon={<LeftOutlined />}
            onClick={() => swiperRef.current?.slidePrev()}
          />
          <Button
            type="text"
            className="nav-button next"
            icon={<RightOutlined />}
            onClick={() => swiperRef.current?.slideNext()}
          />
        </div>
        <Swiper
          modules={[Navigation]}
          onSwiper={(swiper) => (swiperRef.current = swiper)}
          slidesPerView={2}
          spaceBetween={16}
          breakpoints={{
            640: {
              slidesPerView: 2,
            },
            768: {
              slidesPerView: 3,
            },
            1024: {
              slidesPerView: 4,
            },
          }}
        >
          {services.map((service, index) => (
            <SwiperSlide key={index}>
              <div className="service-card">
                <div className={`icon-wrapper ${service.iconColor}`}>
                  {service.icon}
                </div>
                <div className="title">{service.title}</div>
                <div className="description">{service.description}</div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
};

export default function ServiceCards() {
  return (
    <Space direction="vertical" size={16} style={{ flex: 1, paddingTop: 32 }}>
      <Welcome
        style={{
          backgroundImage: 'linear-gradient(97deg, #f2f9fe 0%, #f7f3ff 100%)',
          borderRadius: 4,
          padding: 16,
        }}
        variant="borderless"
        icon="https://mdn.alipayobjects.com/huamei_iwk9zp/afts/img/A*s5sNRo5LjfQAAAAAAAAAAAAADgCCAQ/fmt.webp"
        title="AI 助手"
        description="提供优化代码，解答疑问，执行任务等功能"
      />
    </Space>
  );
}
