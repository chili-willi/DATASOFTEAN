from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('inventario', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='productomodel',
            name='cantidad',
            field=models.PositiveIntegerField(default=0),
        ),
    ]