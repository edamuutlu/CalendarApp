import { DownOutlined, UserOutlined } from '@ant-design/icons'
import { Button, DatePicker, Dropdown, Input, Modal, Space, TimePicker, Form, message } from 'antd'
import dayjs, { Dayjs } from 'dayjs'
import { useContext, useState } from 'react'
import { MdAccessTime, MdDateRange, MdEventRepeat, MdNotes, MdOutlineModeEditOutline } from 'react-icons/md'
import { etkinlikEkle, etkinlikGuncelle, etkinlikSil, TekrarEnum } from '../../stores/EventStore'
import Kullanici from '../../types/Kullanici'
import { ContentContext } from '../../context/ContentProvider'
import { MenuProps } from 'antd/lib'
import Etkinlik from '../../types/Etkinlik'
import { etkinligeKullaniciEkle, EtkinligeKullaniciEkleRequest } from '../../stores/UserStore'

const { RangePicker } = DatePicker;
const dateFormat = "YYYY/MM/DD";

interface MenuItem {
    label: string;
    key: TekrarEnum;
}

const TekrarEnumToString = {
    [TekrarEnum.hic]: "Tekrarlama",
    [TekrarEnum.herGun]: "Her gün",
    [TekrarEnum.herHafta]: "Her hafta",
    [TekrarEnum.herAy]: "Her ay",
    [TekrarEnum.herYil]: "Her yıl",
};

export default function ModalForm() {

    const context = useContext(ContentContext);

    const [baslangicSaati, setBaslangicSaati] = useState<Dayjs>(dayjs());
    const [bitisSaati, setBitisSaati] = useState<Dayjs>(dayjs());
    const [tekrarTipi, setTekrarTipi] = useState<TekrarEnum | undefined>(undefined);
    const [form] = Form.useForm();
    const [kullanicilar, setKullanicilar] = useState<Kullanici[]>([]);
    const [davetliKullanici, setDavetliKullanici] = useState<Kullanici>();

    const [baslik, setBaslik] = useState("");
    const [baslangicTarihi, setBaslangicTarihi] = useState<Dayjs>(dayjs());
    const [bitisTarihi, setBitisTarihi] = useState<Dayjs>(dayjs());
    const [aciklama, setAciklama] = useState("");

    const items: MenuItem[] = [
        {
            label: "Tekrarlama",
            key: TekrarEnum.hic,
        },
        {
            label: "Her Gün",
            key: TekrarEnum.herGun,
        },
        {
            label: `Her Hafta ${dayjs().format("dddd")}`,
            key: TekrarEnum.herHafta,
        },
        {
            label: `Her Ay ${dayjs().format("Do")}`,
            key: TekrarEnum.herAy,
        },
        {
            label: `Her Yıl ${dayjs().format("MMM DD")}`,
            key: TekrarEnum.herYil,
        },
    ];

    const handleMenuClick: MenuProps["onClick"] = (e) => {
        const keyAsNumber = Number(e.key);
        const selectedItem = items.find((item) => item.key === keyAsNumber);

        if (selectedItem) {
            message.info(`Selected: ${selectedItem.label}`);
            setTekrarTipi(keyAsNumber as TekrarEnum);
        }
    };

    const menuProps = {
        items: items.map((item) => ({ key: item.key, label: item.label })),
        onClick: handleMenuClick,
    };

    const handleGuestMenuClick = (e: { key: string }) => {
        const selectedUser = kullanicilar.find((user) => user.id === e.key);
        if (selectedUser) {
            message.info(`Selected: ${selectedUser.isim}`);
            setDavetliKullanici(selectedUser);
        }
    };

    const guestMenuProps = {
        items: kullanicilar.map((user) => ({ key: user.id, label: user.isim })),
        onClick: handleGuestMenuClick,
    };

    if (!context) {
        throw new Error("CalendarContext must be used within a ContentProvider");
    }

    const { dahaOncePencereSecilmediMi, etkinlikData } = context;

    const {
        seciliGun,
        etkinlikPenceresiniGoster,
        setEtkinlikPenceresiniGoster,
        etkinlikleriCek,
    } = context;

    const etkinlikEkleyeBas = async () => {
        const startDateFormat = DayjsToDate(baslangicTarihi);
        const endDateFormat = DayjsToDate(bitisTarihi);
        const startTimeFormat = DayjsToDate(baslangicSaati);
        const endTimeFormat = DayjsToDate(bitisSaati);

        startDateFormat.setHours(
            startTimeFormat.getHours(),
            startTimeFormat.getMinutes(),
            startTimeFormat.getSeconds()
        );

        endDateFormat.setHours(
            endTimeFormat.getHours(),
            endTimeFormat.getMinutes(),
            endTimeFormat.getSeconds()
        );

        // Etkinlik nesnesini oluştur
        const event: Etkinlik = {
            date: seciliGun.toDate(),
            baslik: baslik,
            aciklama: aciklama,
            baslangicTarihi: startDateFormat,
            bitisTarihi: endDateFormat,
            tekrarDurumu: tekrarTipi ?? TekrarEnum.hic,
        };

        try {
            await etkinlikEkle(event);
            const data: Etkinlik[] = await etkinlikleriCek();
            const dayEvents = data.filter((event: Etkinlik) =>
                dayjs(event.baslangicTarihi).isSame(seciliGun, "day")
            );
            console.log("dayEvents", dayEvents);

            // İd'yi number'a çevirme veya uygun tipi kullanma
            const etkinlikId = Number(dayEvents[0].id);

            // davetliKullanici'nın null olmadığından emin olma
            if (davetliKullanici) {
                const request: EtkinligeKullaniciEkleRequest = {
                    etkinlikId: etkinlikId,
                    kullaniciIds: [davetliKullanici.id as string], // `davetliKullanici`'yı `string` olarak belirtme
                };

                await etkinligeKullaniciEkle(request);
            } else {
                console.error("Davetli kullanıcı null veya undefined.");
            }
        } catch (error) {
            console.error("Etkinlik eklenirken hata oluştu:", error);
        }

        // Etkinlik penceresini kapat ve formu sıfırla
        etkinlikPencereKapat();
        setBaslik("");
        setAciklama("");
        etkinlikPencereKapat();

        form.resetFields();
    };

    const etkinlikGuncelleyeBas = async () => {
        const dayEvents = etkinlikData.filter((event) =>
            dayjs(event.baslangicTarihi).isSame(seciliGun, "day")
        );
        const startDateFormat = DayjsToDate(baslangicTarihi);
        const endDateFormat = DayjsToDate(bitisTarihi);
        const startTimeFormat = DayjsToDate(baslangicSaati);
        const endTimeFormat = DayjsToDate(bitisSaati);

        startDateFormat.setHours(
            startTimeFormat.getHours(),
            startTimeFormat.getMinutes(),
            startTimeFormat.getSeconds()
        );

        endDateFormat.setHours(
            endTimeFormat.getHours(),
            endTimeFormat.getMinutes(),
            endTimeFormat.getSeconds()
        );

        const event: Etkinlik = {
            id: dayEvents[0].id,
            date: seciliGun.toDate(),
            baslik: baslik,
            aciklama: aciklama,
            baslangicTarihi: startDateFormat,
            bitisTarihi: endDateFormat,
            tekrarDurumu: tekrarTipi ?? TekrarEnum.hic,
        };
        try {
            await etkinlikGuncelle(event);
            await etkinlikleriCek();
        } catch (error) {
            console.error("Etkinlik güncellenirken hata oluştu:", error);
        }

        etkinlikPencereKapat();
        setBaslik("");
        setAciklama("");
        etkinlikPencereKapat();

        form.resetFields();
    };

    const etkinlikSileBas = async () => {
        const dayEvents = etkinlikData.filter((event) =>
            dayjs(event.baslangicTarihi).isSame(seciliGun, "day")
        );

        try {
            await etkinlikSil(Number(dayEvents[0].id));
            await etkinlikleriCek();
        } catch (error) {
            console.error("Etkinlik silinirken hata oluştu:", error);
        }

        etkinlikPencereKapat();
        setBaslik("");
        setAciklama("");
        etkinlikPencereKapat();

        form.resetFields();
    };

    const tarihleriAl = (baslangıcTarihi: any, bitisTarihi: any) => {
        setBaslangicTarihi(baslangıcTarihi);
        setBitisTarihi(bitisTarihi);
        const baslangicTarihDate = DayjsToDate(baslangıcTarihi);
        const bitisTarihDate = DayjsToDate(bitisTarihi);

        return {
            baslangicTarihDate,
            bitisTarihDate,
        };
    };

    const saatleriAl = (baslangıcSaati: any, bitisSaati: any) => {
        setBaslangicSaati(baslangıcSaati);
        setBitisSaati(bitisSaati);
        const baslangicSaatiDate = DayjsToDate(baslangıcSaati);
        const bitisSaatiDate = DayjsToDate(bitisSaati);

        return {
            baslangicSaatiDate,
            bitisSaatiDate,
        };
    };

    const DayjsToDate = (dayjsObject: Dayjs): Date => {
        return dayjsObject.toDate();
    };

    const etkinlikPencereKapat = () => {
        setBaslik("");
        setAciklama("");
        setBaslangicTarihi(dayjs());
        setBitisTarihi(dayjs());
        setEtkinlikPenceresiniGoster(false);
    };


    return (
        <Modal
            title={dahaOncePencereSecilmediMi ? " Etkinlik Ekle" : "Etkinlik Güncelle"}
            open={etkinlikPenceresiniGoster}
            onCancel={etkinlikPencereKapat}
            className="modal"
            footer={[
                <Button
                    key="submit"
                    type="primary"
                    style={{ backgroundColor: "green", borderColor: "green" }}
                    onClick={() => form.submit()}
                >
                    {dahaOncePencereSecilmediMi ? "Ekle" : "Güncelle"}
                </Button>,
                !dahaOncePencereSecilmediMi && (
                    <Button
                        key="delete"
                        type="primary"
                        style={{ backgroundColor: "red", borderColor: "red" }}
                        onClick={() => etkinlikSileBas()}
                    >
                        Sil
                    </Button>
                ),
            ].filter(Boolean)}
        >
            <Form
                form={form}
                onFinish={dahaOncePencereSecilmediMi ? etkinlikEkleyeBas : etkinlikGuncelleyeBas}
            >
                <Form.Item
                    name="title"
                    rules={[{ required: true, message: "Lütfen etkinlik başlığını giriniz!" }]}
                >
                    <div className="event-input">
                        <MdOutlineModeEditOutline className="event-icon" />
                        <Input
                            placeholder="Etkinlik Başlığı"
                            value={baslik}
                            onChange={(e) => setBaslik(e.target.value)}
                            style={{
                                borderStartStartRadius: "0",
                                borderEndStartRadius: "0",
                            }}
                        />
                    </div>
                </Form.Item>

                <Form.Item
                    name="dateRange"
                    initialValue={
                        dahaOncePencereSecilmediMi ? [seciliGun, dayjs()] : [baslangicTarihi, bitisTarihi]
                    }
                    rules={[
                        { required: true, message: "Lütfen tarih aralığını giriniz!" },
                    ]}
                >
                    <div className="event-input">
                        <MdDateRange className="event-icon" />
                        <RangePicker
                            format={dateFormat}
                            onChange={(values) => tarihleriAl(values?.[0], values?.[1])}
                            minDate={dahaOncePencereSecilmediMi ? dayjs(seciliGun, dateFormat) : dayjs(baslangicTarihi, dateFormat)}
                            defaultValue={
                                dahaOncePencereSecilmediMi ? [seciliGun, dayjs()] : [baslangicTarihi, bitisTarihi]
                            }
                            className="range-picker"
                            style={{
                                borderStartStartRadius: "0",
                                borderEndStartRadius: "0",
                            }}
                        />
                    </div>
                </Form.Item>

                <Form.Item
                    name="timeRange"
                    initialValue={
                        dahaOncePencereSecilmediMi ? [dayjs(), dayjs()] : [baslangicSaati, bitisSaati]
                    }
                    rules={[
                        { required: true, message: "Lütfen saat aralığını giriniz!" },
                    ]}
                >
                    <div className="event-input">
                        <MdAccessTime className="event-icon" />
                        <TimePicker.RangePicker
                            needConfirm={false}
                            onChange={(values) => saatleriAl(values?.[0], values?.[1])}
                            defaultValue={
                                dahaOncePencereSecilmediMi ? [dayjs(), dayjs()] : [baslangicSaati, bitisSaati]
                            }
                            className="range-picker"
                            style={{
                                borderStartStartRadius: "0",
                                borderEndStartRadius: "0",
                            }}
                        />
                    </div>
                </Form.Item>

                <Form.Item
                    name="text"
                    rules={[
                        { required: true, message: "Lütfen etkinlik açıklamasını giriniz!" },
                    ]}
                >
                    <div className="event-input">
                        <MdNotes className="desc-icon" />
                        <Input.TextArea
                            placeholder="Etkinlik Açıklaması"
                            value={aciklama}
                            onChange={(e) => setAciklama(e.target.value)}
                            style={{
                                borderStartStartRadius: "0",
                                borderEndStartRadius: "0",
                            }}
                        />
                    </div>
                </Form.Item>

                <div className="event-input">
                    <UserOutlined className="event-icon" />
                    <Dropdown menu={guestMenuProps} className="dropdown">
                        <Button>
                            <Space>
                                {davetliKullanici?.isim
                                    ? davetliKullanici?.isim
                                    : "Kullanıcı Davet Et"}
                                <DownOutlined />
                            </Space>
                        </Button>
                    </Dropdown>
                </div>

                <div className="event-input">
                    <MdEventRepeat className="event-icon" />
                    <Dropdown menu={menuProps} className="dropdown">
                        <Button>
                            <Space>
                                {tekrarTipi
                                    ? TekrarEnumToString[tekrarTipi ?? TekrarEnum.hic]
                                    : TekrarEnumToString[tekrarTipi ?? TekrarEnum.hic]}
                                <DownOutlined />
                            </Space>
                        </Button>
                    </Dropdown>
                </div>
            </Form>
        </Modal>
    )
}
