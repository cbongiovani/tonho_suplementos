-- ============================================================
-- TONHO SUPLEMENTOS — Seed Data
-- ============================================================

-- Site config default
INSERT INTO public.site_config (id, instagram_url, whatsapp_url)
VALUES (1, 'https://www.instagram.com/tonhosuplementos', 'https://wa.me/5500000000000')
ON CONFLICT (id) DO NOTHING;

-- Products seed (15 products)
INSERT INTO public.products (name, description, category, goals, price, highlight, is_active) VALUES
('Whey Protein Concentrado 900g', 'Proteína de alta qualidade para ganho de massa muscular. 24g de proteína por dose.', 'whey', '{"hipertrofia"}', 129.90, 'mais_vendido', true),
('Whey Protein Isolado 900g', 'Proteína isolada de absorção rápida, low carb e zero gordura. Ideal pós-treino.', 'whey', '{"hipertrofia","emagrecimento"}', 189.90, 'novo', true),
('Creatina Monohidratada 300g', 'Creatina pura para aumento de força e performance nos treinos intensos.', 'creatina', '{"hipertrofia","energia"}', 69.90, 'mais_vendido', true),
('Creatina Micronizada 500g', 'Creatina com partículas menores para melhor absorção e dissolução.', 'creatina', '{"hipertrofia","energia"}', 89.90, 'nenhum', true),
('Pré-Treino Explosive 300g', 'Fórmula com cafeína, beta-alanina e arginina para energia e foco máximos.', 'pre-treino', '{"energia","hipertrofia"}', 99.90, 'promocao', true),
('Pré-Treino Black Fire 250g', 'Pré-treino premium com 300mg de cafeína e nootrópicos. Para avançados.', 'pre-treino', '{"energia"}', 139.90, 'novo', true),
('Termogênico Extreme Cut 60 cáps', 'Acelera o metabolismo e potencializa a queima de gordura durante o treino.', 'termogenico', '{"emagrecimento"}', 89.90, 'mais_vendido', true),
('Termogênico Lipo 6 Black 120 cáps', 'Termogênico potente com cafeína anidra e extrato de pimenta. Resultados rápidos.', 'termogenico', '{"emagrecimento","energia"}', 119.90, 'nenhum', true),
('BCAA 2400 240 cáps', 'Aminoácidos essenciais para recuperação muscular e redução de catabolismo.', 'vitaminas', '{"hipertrofia","emagrecimento"}', 79.90, 'nenhum', true),
('Glutamina 300g', 'Aminoácido para recuperação muscular e fortalecimento do sistema imune.', 'vitaminas', '{"hipertrofia","saude"}', 59.90, 'nenhum', true),
('Multivitamínico Sport 60 cáps', 'Complexo vitamínico completo para atletas. Vitaminas A, C, D, E, B-Complex.', 'vitaminas', '{"saude"}', 49.90, 'nenhum', true),
('Ômega 3 1000mg 120 caps', 'Óleo de peixe rico em EPA e DHA para saúde cardiovascular e redução de inflamação.', 'vitaminas', '{"saude","emagrecimento"}', 44.90, 'nenhum', true),
('Whey Protein Zero Lactose 900g', 'Whey especial para intolerantes à lactose. Mesmo desempenho, zero desconforto.', 'whey', '{"hipertrofia"}', 169.90, 'novo', true),
('Hipercalórico Mass 3kg', 'Ganho de peso e massa muscular acelerado. Alto valor calórico e proteico.', 'whey', '{"hipertrofia"}', 149.90, 'mais_vendido', true),
('Vitamina D3 + K2 60 cáps', 'Combo D3+K2 para saúde óssea, imunidade e desempenho atlético.', 'vitaminas', '{"saude"}', 39.90, 'nenhum', true);
