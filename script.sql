USE [CalenderAppDb]
GO
INSERT [dbo].[Kullanicis] ([Id], [KullaniciAdi], [Isim], [Soyisim], [KullaniciSifresi]) VALUES (N'33a4f755-a60c-4e39-b100-a1da2510fc47', N'murat', N'murat', N'murat', N'A6xnQhbz4Vx2HuGl4lXwZ5U2I8iziLRFnhP5eNfIRvQ=')
INSERT [dbo].[Kullanicis] ([Id], [KullaniciAdi], [Isim], [Soyisim], [KullaniciSifresi]) VALUES (N'424f5c1c-f9f4-4004-873f-416c80762db5', N'eda', N'eda', N'eda', N'UA4wchoHAv07kCR7KNNSNh990R3GlWe3TXfS4KRZX+g=')
INSERT [dbo].[Kullanicis] ([Id], [KullaniciAdi], [Isim], [Soyisim], [KullaniciSifresi]) VALUES (N'851038f7-e17e-4549-92a2-e262c07b2b2e', N'admin', N'admin', N'admin', N'A6xnQhbz4Vx2HuGl4lXwZ5U2I8iziLRFnhP5eNfIRvQ=')
GO
SET IDENTITY_INSERT [dbo].[Etkinliks] ON 

INSERT [dbo].[Etkinliks] ([Id], [Baslik], [Aciklama], [BaslangicTarihi], [BitisTarihi], [TekrarDurumu], [OlusturanKullaniciId]) VALUES (193, N'deneme 1', N'deneme 1', CAST(N'2024-08-06T08:00:51.0000000' AS DateTime2), CAST(N'2024-08-06T09:00:51.0000000' AS DateTime2), 0, N'424f5c1c-f9f4-4004-873f-416c80762db5')
INSERT [dbo].[Etkinliks] ([Id], [Baslik], [Aciklama], [BaslangicTarihi], [BitisTarihi], [TekrarDurumu], [OlusturanKullaniciId]) VALUES (194, N'deneme 2', N'deneme 2', CAST(N'2024-08-06T16:00:51.0000000' AS DateTime2), CAST(N'2024-08-08T17:00:51.0000000' AS DateTime2), 0, N'424f5c1c-f9f4-4004-873f-416c80762db5')
INSERT [dbo].[Etkinliks] ([Id], [Baslik], [Aciklama], [BaslangicTarihi], [BitisTarihi], [TekrarDurumu], [OlusturanKullaniciId]) VALUES (195, N'deneme 3', N'deneme 3', CAST(N'2024-08-08T13:30:51.0000000' AS DateTime2), CAST(N'2024-08-08T14:00:51.0000000' AS DateTime2), 0, N'424f5c1c-f9f4-4004-873f-416c80762db5')
INSERT [dbo].[Etkinliks] ([Id], [Baslik], [Aciklama], [BaslangicTarihi], [BitisTarihi], [TekrarDurumu], [OlusturanKullaniciId]) VALUES (196, N'deneme 4', N'deneme 4', CAST(N'2024-08-08T18:00:51.0000000' AS DateTime2), CAST(N'2024-08-08T18:30:51.0000000' AS DateTime2), 0, N'424f5c1c-f9f4-4004-873f-416c80762db5')
INSERT [dbo].[Etkinliks] ([Id], [Baslik], [Aciklama], [BaslangicTarihi], [BitisTarihi], [TekrarDurumu], [OlusturanKullaniciId]) VALUES (198, N'deneme 5', N'deneme 5', CAST(N'2024-08-13T11:30:51.0000000' AS DateTime2), CAST(N'2024-08-31T12:30:51.0000000' AS DateTime2), 0, N'424f5c1c-f9f4-4004-873f-416c80762db5')
INSERT [dbo].[Etkinliks] ([Id], [Baslik], [Aciklama], [BaslangicTarihi], [BitisTarihi], [TekrarDurumu], [OlusturanKullaniciId]) VALUES (200, N'deneme 6', N'deneme 6', CAST(N'2024-08-14T15:30:51.0000000' AS DateTime2), CAST(N'2024-08-14T16:30:51.0000000' AS DateTime2), 0, N'424f5c1c-f9f4-4004-873f-416c80762db5')
INSERT [dbo].[Etkinliks] ([Id], [Baslik], [Aciklama], [BaslangicTarihi], [BitisTarihi], [TekrarDurumu], [OlusturanKullaniciId]) VALUES (201, N'deneme 7', N'deneme 7', CAST(N'2024-08-16T14:30:51.0000000' AS DateTime2), CAST(N'2024-08-17T15:00:51.0000000' AS DateTime2), 0, N'424f5c1c-f9f4-4004-873f-416c80762db5')
INSERT [dbo].[Etkinliks] ([Id], [Baslik], [Aciklama], [BaslangicTarihi], [BitisTarihi], [TekrarDurumu], [OlusturanKullaniciId]) VALUES (202, N'deneme 8', N'deneme 8', CAST(N'2024-08-24T08:30:51.0000000' AS DateTime2), CAST(N'2024-08-26T09:30:51.0000000' AS DateTime2), 0, N'424f5c1c-f9f4-4004-873f-416c80762db5')
SET IDENTITY_INSERT [dbo].[Etkinliks] OFF
GO
INSERT [dbo].[KullaniciEtkinliks] ([EtkinlikId], [KullaniciId]) VALUES (198, N'33a4f755-a60c-4e39-b100-a1da2510fc47')
GO
INSERT [dbo].[__EFMigrationsHistory] ([MigrationId], [ProductVersion]) VALUES (N'20240523111052_mig_01', N'8.0.5')
INSERT [dbo].[__EFMigrationsHistory] ([MigrationId], [ProductVersion]) VALUES (N'20240716123457_12', N'8.0.5')
GO
